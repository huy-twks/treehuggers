import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching'

cleanupOutdatedCaches()
precacheAndRoute(self.__WB_MANIFEST)

self.addEventListener('push', (event) => {
    const data = event.data.json();
    console.log(data);
    const { gridStatus } = data;

    const responseMsg = gridStatus ? "Grid is dirty!!" : "Grid is clean!!";

    event.waitUntil(
        self.registration.showNotification('TreeHugggers', {
            body: responseMsg
        })
    )
});