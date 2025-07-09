import { getClosestRegion } from '../controller/region-detection'
import { SubcriptionWithRegion } from '../models'

const store: SubcriptionWithRegion[] = [];

const subscribe = (reqBody: any) => {
    const closestRegion = getClosestRegion(reqBody.latitude, reqBody.longitude)
    const newSubscription: SubcriptionWithRegion = {
        subscription: reqBody.subscription,
        region: closestRegion.region
    }

    store.push(newSubscription);
    console.log(store);
    return newSubscription
}

export {
    store,
    subscribe
}