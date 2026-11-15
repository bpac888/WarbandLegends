"""Extract owner-supplied 202611151305.mp4 character scenes, excluding the black transition.
Usage: python tools/prepare-ashwind-ossir.py /path/to/202611151305.mp4
"""
import pathlib,subprocess,json,hashlib,sys
source=pathlib.Path(sys.argv[1]);root=pathlib.Path(__file__).resolve().parents[1];p=root/'data/cinematic-manifest.json';m=json.loads(p.read_text());source_hash=hashlib.sha256(source.read_bytes()).hexdigest()
for clip,character,start,end in [('ashwind-warden','Ashwind Warden',0,2.912774),('ossir-necropolis','necropolis_titan',3.112774,5.379773)]:
 target=root/'assets/cinematics'/f'{clip}.mp4'
 subprocess.run(['ffmpeg','-v','error','-i',str(source),'-an','-vf',f'trim=start={start}:end={end},setpts=PTS-STARTPTS,scale=720:-2,fps=24,setsar=1','-c:v','libx264','-profile:v','high','-level:v','3.1','-preset','slow','-crf','25','-pix_fmt','yuv420p','-movflags','+faststart','-y',str(target)],check=True)
 probe=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration:stream=codec_name,codec_type,width,height,pix_fmt,level','-of','json',str(target)]));data=target.read_bytes()
 entry={'id':clip,'characterId':character,'sourceFile':source.name,'sourceSha256':source_hash,'startSeconds':start,'cutSeconds':end-start,'sourceSeconds':end-start,'holdSeconds':0,'path':str(target.relative_to(root)),'bytes':len(data),'sha256':hashlib.sha256(data).hexdigest(),'probe':probe}
 m['clips']=[c for c in m['clips'] if c['id']!=clip]+[entry]
p.write_text(json.dumps(m,indent=2)+'\n')
