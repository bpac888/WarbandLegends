"""Extract full detail scenes from the owner's vid33 video. Usage: python tools/prepare-vid33.py source.mp4"""
import hashlib, json, pathlib, subprocess, sys
source=pathlib.Path(sys.argv[1]); root=pathlib.Path(__file__).resolve().parents[1]
manifest_path=root/'data/cinematic-manifest.json'; manifest=json.loads(manifest_path.read_text())
source_hash=hashlib.sha256(source.read_bytes()).hexdigest()
cuts=[('zero-singularity','neon_singularity_reaper',0,67),('the-king','the_king',67,135),('alkyron-starbreaker','alkyron_starbreaker',135,203),('malzhur-abyss','abyss_lord',203,265)]
for clip,character,start,end in cuts:
    if len(sys.argv)>2 and clip!=sys.argv[2]: continue
    target=root/'assets/cinematics'/f'{clip}.mp4'
    subprocess.run(['ffmpeg','-v','error','-i',str(source),'-an','-vf',f'trim=start_frame={start}:end_frame={end},setpts=PTS-STARTPTS,fps=24,setsar=1'+(',tpad=stop_mode=clone:stop_duration=0.5' if clip=='alkyron-starbreaker' else ''),'-c:v','libx264','-profile:v','high','-level:v','3.1','-preset','slow','-crf','26','-pix_fmt','yuv420p','-movflags','+faststart','-y',str(target)],check=True)
    probe=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration:stream=codec_name,codec_type,width,height,pix_fmt','-of','json',str(target)]))
    data=target.read_bytes()
    entry={'id':clip,'characterId':character,'sourceFile':'vid33.zip / '+source.name,'sourceSha256':source_hash,'startSeconds':start/24,'cutSeconds':(end-start)/24,'sourceSeconds':(end-start)/24,'holdSeconds':0.5 if clip=='alkyron-starbreaker' else 0,'path':str(target.relative_to(root)),'bytes':len(data),'sha256':hashlib.sha256(data).hexdigest(),'probe':probe}
    if any(c['id']==clip for c in manifest['clips']):
        manifest['clips']=[entry if c['id']==clip else c for c in manifest['clips']]
    else: manifest['clips'].append(entry)
manifest_path.write_text(json.dumps(manifest,indent=2)+'\n')
