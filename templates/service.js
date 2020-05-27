self.addEventListener('push', function (event) {

    const eventInfo = event.data.text();
    const data = JSON.parse(eventInfo);
    const head = data.head || 'New Notification';
    const body = data.body || 'Default content';
    const icon = data.icon || 'https://i.imgur.com/MZM3K5w.png';

    event.waitUntil(
        self.registration.showNotification(head, {
            body: body,
            icon: icon,
            badge: '/?notifications=1'
        })
    );
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close();

    event.waitUntil(
        clients.openWindow(event.notification.badge)
    );

});
