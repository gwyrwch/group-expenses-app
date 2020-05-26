const registerSw = async () => {
    if ('serviceWorker' in navigator) {
        const reg = await navigator.serviceWorker.register('service.js');
        initialiseState(reg);
    } else {
        showNotAllowed("You can't send push notifications ️😢")
    }
};

const initialiseState = (reg) => {
    if (!reg.showNotification) {
        showNotAllowed('Showing notifications isn\'t supported in your browser 😢');
        return;
    }
    if (Notification.permission === 'denied') {
        showNotAllowed('You prevented us from showing notifications ️🤔');
        return;
    }
    if (!'PushManager' in window) {
        showNotAllowed("Push isn't allowed in your browser 🤔");
        return;
    }

    subscribe(reg);
};

const showNotAllowed = (message) => {
    alert(message);
};

function urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    return outputArray.map((output, index) => rawData.charCodeAt(index));
}

const subscribe = async (reg) => {
    const subscription = await reg.pushManager.getSubscription();
    if (subscription) {
        sendSubData(subscription);
        return;
    }

    const key = 'BKsZLz57npuaMW-F08o9YPkZ5r43EFFO3y__iz5TceRZ61D87v--yemmpoqaqfOa_JRHjek-nEQskX4TBcfnCeU';
    const options = {
        userVisibleOnly: true,
        // if key exists, create applicationServerKey property
        ...(key && {applicationServerKey: urlB64ToUint8Array(key)})
    };

    const sub = await reg.pushManager.subscribe(options);
    sendSubData(sub)
};

const sendSubData = async (subscription) => {
    const browser = navigator.userAgent.match(/(firefox|msie|chrome|safari|trident)/ig)[0].toLowerCase();
    const data = {
        status_type: 'subscribe',
        subscription: subscription.toJSON(),
        browser: browser,
    };

    const res = await fetch('/webpush/save_information', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'content-type': 'application/json'
        },
        credentials: "include"
    });

    handleResponse(res);
};

const handleResponse = async (res) => {
    if (res.status !== 201)
        console.log("error in sw subscribing");
};

registerSw();