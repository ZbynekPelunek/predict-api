import express from "express";

const predictRouter = express.Router();

interface DataInterface {
    timestamp: Date;
    value: number;
}

interface ParamsInterface {
    name: string;
    value: number;
}

interface PredictBodyInterface {
    params?: Array<ParamsInterface>;
    data: Array<DataInterface>;
}

interface PredictResponseInterface {
   previous_data: Array<DataInterface>
   prediction: Array<DataInterface> 
}

predictRouter.get('/', (req, res) => {
    res.status(200).send("You will do, what you always wanted to do, and succeed.");
});

predictRouter.post('/', async (req, res) => {
    try {
        const { params, data }: PredictBodyInterface = req.body;

        if(!data) throw "Parameter 'data' is required";
        if(data.length === 0) throw "Parameter 'data' cannot be empty. Expected object with 'timestamp'(date) and 'value'(number)";
        if(data.length === 1) throw "Parameter 'data' must have at least 2 objects with values";

        const prediction: PredictResponseInterface = await makePrediction(params, data);

        return res.status(200).json(prediction);
    } catch(error) {
        console.log(error);
        return res.status(400).json({message: error});
    }
    
});

interface MakePredictionFuncInterface {
    (params: Array<ParamsInterface> | undefined, data: Array<DataInterface>): Promise<PredictResponseInterface>;
};

let makePrediction: MakePredictionFuncInterface;

makePrediction = async (params, data) => {

    if(params){
        if(params.length > 0){
            const daysIndex: number = params.findIndex(n => n.name === 'days');
            //console.log(daysIndex);
            if(daysIndex !== -1){
                const days: number = params[params.findIndex(n => n.name === 'days')].value;
                if(typeof(days) !== 'number') throw "The 'value' of 'name': 'days' must be a number";

                return predictValue(data, days);
            };
        } else {
            throw "Array 'params' cannot be empty";
        };
    };

    return predictValue(data, 30);
};

interface SumAndAvgArrayFuncInterface {
    (numbersArr: Array<number>): number;
};

let sumAndAvgArray: SumAndAvgArrayFuncInterface;

sumAndAvgArray = (numbersArr) => {
    const sum: number = numbersArr.reduce((a, b) => a + b, 0);
    return Math.ceil(sum / numbersArr.length) || 0;
};

interface PredictValueFuncInterface {
    (data: Array<DataInterface>, days: number): PredictResponseInterface;
};

let predictValue: PredictValueFuncInterface;

predictValue = (data, days) => {
    const valuesArray: Array<number> = data.map(d => {
        if(typeof(d.value) !== 'number') throw "Parameter 'value' inside 'data' array must be a number";
        return d.value
    });
    //const avgAllValues: number = sumAndAvgArray(valuesArray);

    const lastTimestamp: Date = new Date(data[data.length - 1].timestamp);
    const lastTimestamp2: Date = lastTimestamp;

    const nextWeek: Date = new Date(lastTimestamp.setDate(lastTimestamp.getDate() + 7));
    const minusThirtyDays: Date = new Date(lastTimestamp2.setDate(lastTimestamp2.getDate() - days));
    //console.log(lastTimestamp.getDate());

    const valuesForLastThirtyDays: Array<number> = data.filter(v => new Date(v.timestamp) > minusThirtyDays ).map(d => d.value);
    //console.log(valuesForLastThirtyDays);
    const differenceBetweenValues: Array<number> = [];
    for(let i: number = valuesForLastThirtyDays.length - 1; i > 0; i--){
        differenceBetweenValues.push(valuesForLastThirtyDays[i] - valuesForLastThirtyDays[i - 1]);
    };
    const avgDifference = sumAndAvgArray(differenceBetweenValues);
    //console.log(differenceBetweenValues);

    const predictedValue: number = valuesArray[valuesArray.length - 1] + avgDifference;

    return {"previous_data": data, "prediction": [{"timestamp": nextWeek, "value": predictedValue}]};
}

export default predictRouter;