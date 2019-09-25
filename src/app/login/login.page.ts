import { Component, OnInit } from '@angular/core';
import Torus from "@toruslabs/torus-embed";
import { NavController, LoadingController} from '@ionic/angular';
import { WalletService } from '../wallet.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  torus: any;
  loader: any;
  constructor(private navCtrl: NavController, private loadCtrl: LoadingController ,private wallet: WalletService) { }

  async initTorus() {
    
  }

  ngOnInit() {
  }
  async login() {
    this.loader = await this.loadCtrl.create({
      message: 'Please wait..',
      spinner: 'bubbles'
    });
    await this.loader.present();

    try {
      this.torus = new Torus({buttonPosition: 'bottom-left'});
      this.initTorus();
      await this.torus.init({network: {host: 'mainnet'}}); // other network options --- kovan, rospten, rinkeby
      this.torus.login()
      .then(res => {
        console.log("res login" +res);
        this.wallet.setAccount(res);
        this.wallet.setTorus(this.torus);
        this.navCtrl.navigateRoot('/home');
        console.log(this.torus);
        this.loader.dismiss();
      })
      
      // await this.torus.login(); // await torus.ethereum.enable()
      
      // window.torus = torus
    } catch (error) {
      console.error(error);
      this.loader.dismiss();
    }

  }


}
