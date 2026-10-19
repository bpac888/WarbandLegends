"""One-time import from the owner's Warband Legends checkout. No runtime dependency."""
import argparse, ast, importlib.util, json, subprocess, hashlib
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
def literal_list(path, key):
    for node in ast.parse(path.read_text()).body:
        if isinstance(node, (ast.Assign, ast.AnnAssign)):
            target = node.target if isinstance(node, ast.AnnAssign) else node.targets[0]
            if getattr(target, 'id', None) == key:
                return ast.literal_eval(node.value)
    raise ValueError(key)

def main(source):
    backend = source / 'backend'
    champions = literal_list(backend/'server.py', 'CHAMPION_TEMPLATES')
    champions += literal_list(backend/'veldtborn_data.py', 'VELDTBORN_TEMPLATES')
    champions += literal_list(backend/'roster_expansion_data.py', 'ROSTER_EXPANSION_TEMPLATES')
    spec = importlib.util.spec_from_file_location('source_effects', backend/'effects_data.py')
    fx = importlib.util.module_from_spec(spec); spec.loader.exec_module(fx)
    colors = {'bloodcourt':'red','dragondynasty':'red','frost':'blue','ironclad':'blue','wildgrove':'green','veldtborn':'green','chymera':'green','duneriders':'yellow','neonsyndicate':'yellow','nether':'purple','umbra':'purple'}
    rows, missing = [], []
    for champion in champions:
        cid = champion['template_id']; original = backend/'static'/champion['image_url'].split('/api/static/')[-1]
        row = {**champion,'id':cid,'color':colors[champion['faction'].replace('_','')],'source_image':champion['image_url'],
               'portrait':f'assets/champions/{cid}.webp','kit':fx.kit_for(cid),'passive':fx.passive_for(cid)}
        rows.append(row)
        if original.exists():
            subprocess.run(['magick',str(original),'-resize','480x640>','-strip','-quality','79',str(ROOT/row['portrait'])],check=True)
        elif not (ROOT/row['portrait']).exists(): missing.append({'id':cid,'source':champion['image_url']})
    (ROOT/'data/source-champions.json').write_text(json.dumps(rows,indent=2)+'\n')
    (ROOT/'data/source-effects.json').write_text(json.dumps(fx.EFFECTS,indent=2)+'\n')
    (ROOT/'data/import-manifest.json').write_text(json.dumps({'source_repository':'bpac888/warband-legends','source_commit':'acf554c4666208758a0c198f9fc2c1aef6e54aa4','champions':len(rows),'artwork_imported':len(rows)-len(missing),'missing_artwork':missing,'original_ids_preserved':True,'source_id_sha256':hashlib.sha256('\n'.join(sorted(c['id'] for c in rows)).encode()).hexdigest()},indent=2)+'\n')
    subprocess.run(['node','tools/rebalance-roster.mjs'],cwd=ROOT,check=True)
    print(json.dumps({'champions':len(rows),'missing':missing}))

if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--source',type=Path,required=True);main(parser.parse_args().source)
