import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController } from '@ionic/angular';
import Web3 from 'web3';
import { HttpClient, HttpParams } from '@angular/common/http';
declare var zeroExInstant: any;
import { WalletService } from '../wallet.service';
import Torus from "@toruslabs/torus-embed";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  zeroXprovider: any;
  torus: any;
  address: any;
  balance : any;
  emailRx: any;
  addressRx : any;
  addressTx : any;
  amount: any;
  web3: any = {};
  constructor(private wallet: WalletService, 
              private navCtrl: NavController,
              private alertCtrl: AlertController,
              private loadingCtrl: LoadingController,
              private http: HttpClient
              ) {
    this.torus = this.wallet.torus;
    this.address = this.wallet.account;
    this.web3 = new Web3(this.torus.provider);
    this.zeroXprovider = this.web3.currentProvider; 
  }

  ngOnInit() {
    this.web3.eth.getAccounts().then(accounts => {
      this.web3.eth.getBalance(accounts[0]).then( res => {
        console.log('bal ' + res)
        this.balance = res/10**18;
        this.addressTx = accounts[0];
        console.log("acc: "+this.wallet.account+", bal: "+ this.balance)
      });
    });
    //this.getUserInfo();
  }

  async getUserInfo() {
    console.log(await this.torus.getUserInfo(true));
  }

  back() {
    console.log("back");
    
  }

  async resolveEmail() {
    console.log("email")
    if(this.emailRx){
      this.addressRx =  await this.torus.getPublicAddress(this.emailRx);
      console.log(this.addressRx)
    }
  }

  async sendETH() {
    let main = this;
    console.log("send")
    if(this.addressRx && this.amount){
      let loader = await this.loadingCtrl.create({
        message: 'Submitting transaction ...',
        spinner: 'bubbles'
      });
      loader.present().then(() => {
        this.torus.web3.eth.sendTransaction({
          from: this.addressTx,
          to: this.addressRx,
          value: Number(this.amount)*10**18
        }, function(err, transactionHash) {
          if (err) { 
              console.log(err);
              loader.dismiss(); 
          } else {
              main.submitEmail();
              loader.dismiss(); 
              main.ngOnInit();
              console.log(transactionHash);
          }
        });
      });
    }else  
      alert('Please specify an Ethereum address and the amount first.');
  }

  async submitEmail() {
    let params = new HttpParams();
              // Begin assigning parameters
    params = params.append('to', this.emailRx);
    params = params.append('subject', '0xO Notification: You have just received a new Ether transfer.');
    params = params.append('text','Hi, \n You have just received a new Ether transfer from address (' + this.addressTx + ') with the amount of (' + this.amount + ') ETH. \n Visit this link and login with your gmail account to access your wallet. \n \n https://0xo.surge.sh/ \n \n Thanks, \n 0xO Team');
    this.http.get('https://torusemail.herokuapp.com/send',{params: params} ).subscribe(data => {
      console.log('invite and transaction submitted successfully.');
    }, err => {
      console.log('Transaction submitted but system failed to send the invite email.');
    });
  }

  async showButton() {
    this.getUserInfo();
  }

  showWallet() {
    this.torus.showWallet(false);
    
  }


  launch0x() {
    let provider = this.zeroXprovider;
    // create ledger instance
    zeroExInstant.render(
      {
        orderSource: 'https://sra.bamboorelay.com/0x/v2/', //'https://api.radarrelay.com/0x/v2/',
          provider: provider,
          walletDisplayName: '0xO',
          affiliateInfo: {
                  feeRecipient: '0x57328ec619d9d6c2b0428472d1cebaf3cf6b8f5d',
                  feePercentage: 0.025
                },
          networkId: 1,
          // shouldDisableAnalyticsTracking: true,
      },
      'body',
    );
  }

  async invite() {
    let confirm = await this.alertCtrl.create({
      header: 'Invite to Crypto',
      message: "You can surprise someone by sending them crypto to their email address and get them to experince it",
      inputs: [
        {
          name: 'from',
          placeholder: 'Confirm your Email Address'
        },
        {
          name: 'email',
          placeholder: 'Receiver Email Address'
        },
        {
          name: 'amount',
          placeholder: 'Amount in ETH'
        }
      ],
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
           
        }
      }, {
        text: 'Confirm',
        handler: data => {
          this.presentInviteLoader(data);
        }
      }]
    });
    confirm.present();
  }

  async presentInviteLoader(data) {
    let main = this;
    let _http = this.http;
    let toAddress = await this.torus.getPublicAddress(data.email);
    let fromAddress = this.addressTx;
    
    if(toAddress && data.amount && data.from){
      let params = new HttpParams();

      // Begin assigning parameters
      params = params.append('to', data.email);
      params = params.append('subject', 'Enjoy access to crypto with only an email address.');
      params = params.append('text','Hi, \n The holder of this email address (' + data.from + ') is inviting you to start using crypto all thorugh only an email address. \n Visit this link and login with your gmail account to access your wallet. \n \n https://0xo.surge.sh/ \n \n Thanks, \n 0xO Team');
      let mailoptions = {
        to: data.email,
        subject: 'Enjoy access to crypto with only an email address.',
        text: 'Hi, \n The holder of this email address (' + data.from + ') is inviting you to start using crypto all thorugh only an email address. \n Visit this link and login with your gmail account to access your wallet. \n \n https://0xo.surge.sh/ \n \n Thanks, \n 0xO Team'
      }
      let loader = await this.loadingCtrl.create({
        message: 'Please wait..',
        spinner: 'bubbles'
      });
      loader.present().then(() => {
          this.torus.web3.eth.sendTransaction({
            from: fromAddress,
            to: toAddress,
            value: Number(data.amount)*10**18
          }, function(err, transactionHash) {
            if (err) { 
              console.log(err)
              loader.dismiss();
              alert('Failed to send the invite and Ether amount specified.');
            } else {
              _http.get('https://torusemail.herokuapp.com/send',  {params: params} ).subscribe(data => {
                alert('Thanks you, invite and transaction submitted successfully.');
                loader.dismiss();
                main.ngOnInit();
              }, err => {
                
                alert('Transaction submitted but system failed to send the invite email.');
                loader.dismiss();
                main.ngOnInit();
              });
              
            }
          });
      });
    } else{
      alert('Please specify a valid gmail address and correct ETH amount.');
    }
    
  }

  async signout() {
    await this.torus.logout();
    this.navCtrl.navigateRoot('/login');
  }

}
