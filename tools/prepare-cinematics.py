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
cuts=[('iseldra',0,10.15,1.65,'magic_iseldra'),('juggernaut',1,1.88,2.05,'bronze_juggernaut'),('vex',1,12.0,1.12,'elixir_apotheon'),('jade-dragon',1,8.25,1.5,'qingluo_jade_tempest'),('intro-realm',1,13.65,1.55,None)]
clips=[]
for name,part,start,duration,champion in cuts:
    target=out/(name+'.mp4');vf='scale=720:-2,fps=24'+(',gblur=sigma=40' if name=='intro-realm' else '')
    subprocess.run(['ffmpeg','-v','error','-ss',str(start),'-i',str(parts[part]),'-t',str(duration),'-an','-vf',vf,'-c:v','libx264','-preset','medium','-crf','24' if name=='intro-realm' else '22','-pix_fmt','yuv420p','-movflags','+faststart','-y',str(target)],check=True)
    info=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration:stream=codec_name,codec_type,width,height,pix_fmt','-of','json',str(target)]))
    data=target.read_bytes()
    if len(data)>2000000:raise SystemExit(f'{name} exceeds 2 MB mobile budget')
    clips.append({'id':name,'characterId':champion,'sourcePart':part+1,'startSeconds':start,'cutSeconds':duration,'path':str(target.relative_to(root)),'bytes':len(data),'sha256':hashlib.sha256(data).hexdigest(),'probe':info})
manifest={'source':'Owner-supplied Warband Legends trailer, two portrait uploads','sourceSha256':[hashlib.sha256(p.read_bytes()).hexdigest() for p in parts],'clips':clips,'notes':['Original uploads remain outside the production bundle.','Intro background is blurred to obscure the baked-in older branding; the live interface overlays the current owner logo and wordmark.','Muted inline playback, still artwork fallback, Reduced Motion and user cinematic preference apply.']}
(root/'data/cinematic-manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
print(json.dumps({'clips':len(clips),'totalBytes':sum(c['bytes'] for c in clips),'width':720}))
