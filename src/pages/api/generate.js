import axios from "axios";

export default async (req, res) => {
    try {
        console.log(req.body)
        const url = 'https://us-south.ml.cloud.ibm.com/ml/v1-beta/generation/text?version=2023-05-29';

        const data = {
            model_id: 'google/flan-ul2',
            input: `${req.body.prompt}`,
            parameters: {
                decoding_method: 'greedy',
                max_new_tokens: 1000,
                min_new_tokens: 0,
                stop_sequences: [],
                repetition_penalty: 1
            },
            project_id: '62f0108d-57d9-413b-a791-19e8d97a565f'
        };

        const response = await axios.post(url, data, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${req.body.ibmKey}`
            }
        })

        // console.log(response.data.results)
        return res.send({ status: 200, data: response.data.results[0] });


    } catch (e) {
        console.log(e)
        throw e;
    }



}