"""Cut the owner's two trailer parts into mobile HD clips. Never changes original art.
Usage: python tools/prepare-cinematics.py --part-one /path/part1.mov --part-two /path/part2.mov
Requires ffmpeg and ffprobe. All clips are silent H.264 MP4, yuv420p, fast-start.
"""
import argparse, hashlib, json, pathlib, subprocess
parser=argparse.ArgumentParser();parser.add_argument('--part-one',required=True);parser.add_argument('--part-two',required=True);args=parser.parse_args()
parts=[pathlib.Path(args.part_one),pathlib.Path(args.part_two)]
for p in parts:
    if not p.is_file():raise SystemExit(f'Missing source: {p}')
root=pathlib.Path(__file__).resolve().parents[1];out=root/'assets/cinematics';out.mkdir(exist_ok=True)
# Full character shots; boundaries exclude the neighbouring character/branding.
# Timeline values are seconds in the owner's original two uploads.
cuts=[('worldwound',0,0,.97944,'yshmir_worldwound'),('sun-omen',0,.97944,1.7,'azhar_rosetted_sun'),('prism-gaze',0,2.67944,2.083334,'gorgythe_prism_gaze'),('moonward',0,4.762774,1.683333,'asterox_labyrinth_moon'),('burning-gate',0,6.446107,2.2,'pit_grunt'),('ironhorn-rider',0,8.646107,1.433333,'goblins_brondak'),('iseldra',0,10.07944,2.583334,'magic_iseldra'),('sin-archon',0,12.662774,2.082226,'sin_archon'),('crimson-praetor',1,0,1.833334,'crimson_praetor'),('juggernaut',1,1.833334,2.2,'bronze_juggernaut'),('plasma-skirmisher',1,4.033334,3.233333,'inko_plasma_skirmisher'),('jade-dragon',1,7.266667,2.55,'qingluo_jade_tempest'),('last-escort',1,9.816667,1.533333,'blood_paladin'),('vex',1,11.35,2.0,'elixir_apotheon'),('intro-realm',1,13.65,2.0,None)]
clips=[]
for name,part,start,duration,champion in cuts:
    target=out/(name+'.mp4');vf=('trim=duration=1.55,scale=720:-2,fps=24,tpad=stop_mode=clone:stop_duration=0.45' if name=='intro-realm' else 'scale=720:-2,fps=24')
    subprocess.run(['ffmpeg','-v','error','-ss',str(start),'-i',str(parts[part]),'-t',str(duration),'-an','-vf',vf,'-c:v','libx264','-preset','medium','-crf','22','-pix_fmt','yuv420p','-movflags','+faststart','-y',str(target)],check=True)
    info=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration:stream=codec_name,codec_type,width,height,pix_fmt','-of','json',str(target)]))
    data=target.read_bytes()
    if len(data)>2000000:
        subprocess.run(['ffmpeg','-v','error','-ss',str(start),'-i',str(parts[part]),'-t',str(duration),'-an','-vf',vf,'-c:v','libx264','-preset','slow','-crf','25','-pix_fmt','yuv420p','-movflags','+faststart','-y',str(target)],check=True)
        data=target.read_bytes()
        if len(data)>2000000:raise SystemExit(f'{name} exceeds 2 MB mobile budget')
    clips.append({'id':name,'characterId':champion,'sourcePart':part+1,'startSeconds':start,'cutSeconds':duration,'sourceSeconds':1.55 if name=='intro-realm' else duration,'holdSeconds':0.45 if name=='intro-realm' else 0,'path':str(target.relative_to(root)),'bytes':len(data),'sha256':hashlib.sha256(data).hexdigest(),'probe':info})
manifest={'source':'Owner-supplied Warband Legends trailer, two portrait uploads','sourceSha256':[hashlib.sha256(p.read_bytes()).hexdigest() for p in parts],'clips':clips,'notes':['Original uploads remain outside the production bundle.','Character clips cover their complete source scenes; only neighbouring shots are excluded.','Intro preserves the original final logo scene without blur or separate branding overlays; the last frame is held briefly to give two seconds of clean logo footage.','Muted inline playback, still artwork fallback, Reduced Motion and user cinematic preference apply.']}
(root/'data/cinematic-manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
print(json.dumps({'clips':len(clips),'totalBytes':sum(c['bytes'] for c in clips),'width':720}))
