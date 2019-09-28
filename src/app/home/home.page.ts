import { Component } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';
import Web3 from 'web3';
declare var zeroExInstant: any;
import { WalletService } from '../wallet.service';

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
  constructor(private wallet: WalletService, private navCtrl: NavController,private modalCtrl: ModalController) {
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
    console.log("send")
    if(this.addressRx && this.amount)
      this.torus.web3.eth.sendTransaction({
        from: this.addressTx,
        to: this.addressRx,
        value: this.amount
      }, function(err, transactionHash) {
        if (err) { 
            console.log(err); 
        } else {
            console.log(transactionHash);
        }
      });
    else  
      alert('Please specify an Ethereum address and the amount first.');
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

  async signout() {
    await this.torus.logout();
    this.navCtrl.navigateRoot('/login');
  }

}
