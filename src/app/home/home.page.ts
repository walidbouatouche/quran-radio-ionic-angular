import { Component } from '@angular/core';
import { QuranService, QuranOptions } from '../api/quran.service'

import { MusicControls } from '@ionic-native/music-controls/ngx';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {

  quran: QuranOptions = {
    title: "",
    currentTime: "",
    duration: "",
    isStopped: true,
    isplaying: false,
    iswaiting: false,
    link_mp3: ""
  };

  Soura: any;
  data: {};
  progress: any;
  status: any;
  titlenow: any;
  img: string;

  constructor(
    public musicControls: MusicControls,
    private quranService: QuranService) {

    // get list of Qurans from services
    this.data = this.quranService.getQuranItems();

  }


  resume() {
    // pause or resume we put progress 0
    if (this.progress === 0) {
      this.play();
      this.showPlayLogot();
    }

    else {
      this.Soura.play();
      this.showPlayLogot();
    }

  }


  play() {

    this.showMusicControles(); // chow music Control in dvice

    /* 
    we make this test beause first time when app open there not soura
     if user click pause we will disabled 
     */

    if (this.Soura) {
      this.Soura.pause();
    }

    // the title here mean the number of soura not the char title gedt by ngmodel
    this.quran.link_mp3 = "/assets/quran/quran/" + this.quran.title + ".mp3";


    /*
     new object Audoi we can use a good package 
       but i use tradtional Audio javascripte for can
       control everything by javascripte pure 
    
     */
    this.Soura = new Audio(this.quran.link_mp3);

    this.Soura.addEventListener("timeupdate", () => {
      
      this.quran.currentTime = this.parseTime(this.Soura.currentTime);
      this.quran.duration = this.parseTime(this.Soura.duration);
      this.progress = this.Soura.currentTime / this.Soura.duration;
      if (this.quran.duration === this.quran.currentTime) {
        this.musicControls.updateIsPlaying(false);
        this.pause();
        this.progress = 0;
        this.Soura.duration = 0;

      }

      // pause status we will automaticly pasue musicContol native 
      if (this.Soura.paused) {
        this.musicControls.updateIsPlaying(false);
        this.pause();
        this.progress = 0;
        this.Soura.duration = 0;

      }

      this.musicControls.updateIsPlaying(!this.Soura.paused);
    });


    this.quran.isStopped = false;
    this.quran.iswaiting = true;
    setTimeout(() => {
      // we pause the audio  from  DOM
      this.Soura.play();
      this.showPlayLogot();

    }, 0);

  }



  pause() {
    // we pause the audio from  DOM
    this.Soura.pause();
    this.showPauseLogot();

  }



  showPauseLogot() {
    // if playing we show pause logot ... 
    this.quran.isStopped = true;
    this.quran.isplaying = false;
    this.quran.iswaiting = false;
  }


  showPlayLogot() {
    // if  pause we show  play logot ... 
    this.quran.iswaiting = false;
    this.quran.isplaying = true;
    this.quran.isStopped = false;
  }


  /*
    *  function for convert mill soconde to minut evrey change
    * do not worry aboute it  it is famous function 
       */

  parseTime(time = "0.00 ", action?: string) {

    if (time) {
      const partTime = parseInt(time.toString().split(".")[0], 10);
      let minutes = Math.floor(partTime / 60).toString();
      if (minutes.length == 1) {
        minutes = "0" + minutes;
      }
      let seconds = (partTime % 60).toString();
      if (seconds.length == 1) {
        seconds = "0" + seconds;
      }
      if (action === "no") {
        return minutes + seconds;
      }
      return minutes + ":" + seconds;
    }
  }





  showMusicControles() {
    this.musicControls.destroy();
    let index = parseInt(this.quran.title) - 1;
    this.musicControls.create({
      track: "☢ تستمعون  ☢ ",        // optional, default : ''
      artist: this.data[index].name,                       // optional, default : ''
      cover: 'assets/img/icon.png',      // optional, default : nothing
      // cover can be a local path (use fullpath 'file:///storage/emulated/...', or only 'my_image.jpg' if my_image.jpg is in the www folder of your app)
      //           or a remote url ('http://...', 'https://...', 'ftp://...')
      isPlaying: true,                         // optional, default : true
      dismissable: false,                         // optional, default : false
      // hide previous/next/close buttons:
      hasPrev: false,      // show previous button, optional, default: true
      hasNext: false,      // show next button, optional, default: true
      hasClose: false,       // show close button, optional, default: false

      // iOS only, optional
      album: 'Absolution',     // optional, default: ''
      duration: 60, // optional, default: 0
      elapsed: 10, // optional, default: 0
      hasSkipForward: true,  // show skip forward button, optional, default: false
      hasSkipBackward: true, // show skip backward button, optional, default: false
      skipForwardInterval: 15, // display number for skip forward, optional, default: 0
      skipBackwardInterval: 15, // display number for skip backward, optional, default: 0
      hasScrubbing: true, // enable scrubbing from control center and lockscreen progress bar, optional
      // Android only, optional
      // text displayed in the status bar when the notification (and the ticker) are updated, optional
      ticker: 'Now playing "Time is Running Out"',
      // All icons default to their built-in android equivalents
      playIcon: 'media_play',
      pauseIcon: 'media_pause',
      prevIcon: 'media_prev',
      nextIcon: 'media_next',
      closeIcon: 'media_close',
      notificationIcon: 'notification'
    });

    this.musicControls.subscribe().subscribe(action => {
      const message = JSON.parse(action).message;
      switch (message) {
        case 'music-controls-next':
          // Do something
          break;
        case 'music-controls-previous':
          // Do something
          break;
        case 'music-controls-pause':
          this.Soura.pause();
          this.showPauseLogot();
          this.musicControls.listen();
          this.musicControls.updateIsPlaying(false);
          break;
        case 'music-controls-play':
          if (this.quran.duration === this.quran.currentTime) {

            this.musicControls.updateIsPlaying(false);
            this.pause();
            this.progress = 0;
            this.Soura.duration = 0;

          }
          this.Soura.play();
          this.showPlayLogot();

          this.musicControls.listen();
          this.musicControls.updateIsPlaying(true);


          break;
        case 'music-controls-destroy':
          // Do something
          break;

        // External controls (iOS only)
        case 'music-controls-toggle-play-pause':
          // Do something
          break;
        case 'music-controls-seek-to':

          // Do something
          break;
        case 'music-controls-skip-forward':
          // Do something
          break;
        case 'music-controls-skip-backward':
          // Do something
          break;

        // Headset events (Android only)
        // All media button events are listed below
        case 'music-controls-media-button':
          // Do something
          break;
        case 'music-controls-headset-unplugged':
          // Do something
          break;
        case 'music-controls-headset-plugged':
          // Do something
          break;
        default:
          break;
      }

    });
    this.musicControls.listen();
    this.musicControls.updateIsPlaying(true);


  }

























}
