class Anim {
  constructor(frames, delay = 0) {
    this.frames = frames;
    this.currentFrame = 0;
    this.frameCount = frames.length-1;
    this.onDelay = delay > 0;
    this.delay = this.onDelay ? new DateTimeClock(delay) : null;
  }

  nextFrame() {
    if(OnPause) return this.frames[this.currentFrame];

    if (!this.onDelay || this.delay.check()) {
      this.currentFrame = this.currentFrame == this.frameCount ? 0 : this.currentFrame + 1;
    }

    return this.frames[this.currentFrame];
  }

  nextFrameOrReturnImage(image) {
    if ((!this.onDelay || this.delay.check()) && this.currentFrame < this.frames.length) {
      this.currentFrame += 1;
    }

    return this.currentFrame > this.frameCount ? image : this.frames[this.currentFrame];
  }

  getFirst(){
    return this.frames[0];
  }

  reset(){
    this.currentFrame = 0;
  }

  byProc(animationProgress) {
    const progress = Math.max(0, Math.min(1, animationProgress));
    let frameIndex = parseInt(Math.floor(progress * this.frameCount));

    if(frameIndex >= this.frameCount) frameIndex = this.frameCount - 1;
    else if(frameIndex < 0) frameIndex = 0;
    this.currentFrame = frameIndex;

    return this.frames[frameIndex];
  }
}

class ecbAnim extends Anim {
  constructor(frames, syncobj) {
    super(frames);
    this.endcallback = null;
    this.syncobj = syncobj;
  }

  nextFrame() {
    const syncobj = this.syncobj;

    if(OnPause) return this.frames[syncobj.currentFrame];

    if (syncobj.delay.check()) {
      if(syncobj.currentFrame == this.frameCount){
        syncobj.currentFrame = 0;
      }
      else syncobj.currentFrame++;

      if(syncobj.currentFrame == this.frameCount-1){
        this.endcallback();
      }
    }

    return this.frames[syncobj.currentFrame];
  }
}

class PuzzAnim extends Anim{
  constructor(frames, delay = 0) {
    super(frames,delay);
    this.puzzdata = [];
    for(let i = 0; i < frames.length; i++){
      const frame = frames[i];
      this.puzzdata.push(frame.puzz);
    }
  }
}
