import { Router, Request, Response } from "express";
import { BASE } from "../constants/base";
import { getAvgCarbonIntensityOverTime, getCurrentCarbonIntensity, isGridDirty } from "../service/CalculateAvgCarbonIntensity";
import bodyParser from "body-parser";

const router = Router();
const jsonParser = bodyParser.json()

router.get(BASE.PREFIX + '/gridstatus', async (req: Request, res: Response) => {
    let avg =  await getAvgCarbonIntensityOverTime('eastus', new Date('2022-10-27'));
    let curr =  await getCurrentCarbonIntensity('eastus');
    res.send(isGridDirty(curr, avg));
  });

router.post(BASE.PREFIX + '/subscribe', jsonParser, async (req: Request, res: Response) => {
    console.log(req.body)
    res.send(req.body)
    // use now as datetime
})

export {router};