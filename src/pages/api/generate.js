import axios from "axios";

export default async (req, res) => {
    try {
        console.log(req.body)
        const url = 'https://us-south.ml.cloud.ibm.com/ml/v1-beta/generation/text?version=2023-05-29';
        const accessToken = 'eyJraWQiOiIyMDIzMTAwODA4MzUiLCJhbGciOiJSUzI1NiJ9.eyJpYW1faWQiOiJJQk1pZC02OTEwMDA2RDFaIiwiaWQiOiJJQk1pZC02OTEwMDA2RDFaIiwicmVhbG1pZCI6IklCTWlkIiwianRpIjoiMjVlOWVkMjYtNjhjOS00OTA1LWFiYzUtZjZlMjNkYTNhZDhmIiwiaWRlbnRpZmllciI6IjY5MTAwMDZEMVoiLCJnaXZlbl9uYW1lIjoiVGFsYmVydCIsImZhbWlseV9uYW1lIjoiSGVybmRvbiIsIm5hbWUiOiJUYWxiZXJ0IEhlcm5kb24iLCJlbWFpbCI6InRhbGJlcnRoZXJuZG9uMUBnbWFpbC5jb20iLCJzdWIiOiJ0YWxiZXJ0aGVybmRvbjFAZ21haWwuY29tIiwiYXV0aG4iOnsic3ViIjoidGFsYmVydGhlcm5kb24xQGdtYWlsLmNvbSIsImlhbV9pZCI6IklCTWlkLTY5MTAwMDZEMVoiLCJuYW1lIjoiVGFsYmVydCBIZXJuZG9uIiwiZ2l2ZW5fbmFtZSI6IlRhbGJlcnQiLCJmYW1pbHlfbmFtZSI6Ikhlcm5kb24iLCJlbWFpbCI6InRhbGJlcnRoZXJuZG9uMUBnbWFpbC5jb20ifSwiYWNjb3VudCI6eyJ2YWxpZCI6dHJ1ZSwiYnNzIjoiZGZlNTA4ZDEzMWI4NDdiNjhkNmRkZTE3ZWExNjE3ZjUiLCJpbXNfdXNlcl9pZCI6IjExNTAwNjM0IiwiaW1zIjoiMjcxMTUxNyJ9LCJpYXQiOjE2OTg4NDM4ODMsImV4cCI6MTY5ODg0NzQ4MywiaXNzIjoiaHR0cHM6Ly9pYW0uY2xvdWQuaWJtLmNvbS9pZGVudGl0eSIsImdyYW50X3R5cGUiOiJ1cm46aWJtOnBhcmFtczpvYXV0aDpncmFudC10eXBlOnBhc3Njb2RlIiwic2NvcGUiOiJpYm0gb3BlbmlkIiwiY2xpZW50X2lkIjoiYngiLCJhY3IiOjEsImFtciI6WyJwd2QiXX0.fIFxN_g1ZA28hy2syMwnct8fLSq1z2WlmAMB4R4mXVO0rJhyqOdZ89yQgBB-hyIkYz-yLoVsZlSV8P8VHvt8DS3Ui137s7ekQDwVcJdy6yacrn-tcox9I0o3i2gpJUNV8OnUcP6p3Ziqxs2crYJP8mMX_oXbnf3stVDUE2RH5Tx5OpAdSY-1CyYhgPKHjvDwPHepTWC47Ib0tYrf8j3DDZ0tTqu9wBBCxRMDO-lrIUH2GzlEUcmUvITmBGjriNNfVt4ajSaWDHEB_V-DU7nLkfViF0c6dpnaDlbmhdI5WBk_jPnF2NywQoJ8f-At167dBuyM0xPo6VWVlxOripJpbg'; // Replace with your access token

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
            project_id: 'c8fbdaf2-d78a-4bef-abce-7fe69dc19a19'
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