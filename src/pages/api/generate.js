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
                max_new_tokens: 1500,
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
                'Authorization': `Bearer eyJraWQiOiIyMDIzMTAwODA4MzUiLCJhbGciOiJSUzI1NiJ9.eyJpYW1faWQiOiJJQk1pZC02OTEwMDA2RDFaIiwiaWQiOiJJQk1pZC02OTEwMDA2RDFaIiwicmVhbG1pZCI6IklCTWlkIiwianRpIjoiNmMxNTYxNjMtNzA5NC00ZWNlLTlmYzItZjk5NzkzNjc3OGMxIiwiaWRlbnRpZmllciI6IjY5MTAwMDZEMVoiLCJnaXZlbl9uYW1lIjoiVGFsYmVydCIsImZhbWlseV9uYW1lIjoiSGVybmRvbiIsIm5hbWUiOiJUYWxiZXJ0IEhlcm5kb24iLCJlbWFpbCI6InRhbGJlcnRoZXJuZG9uMUBnbWFpbC5jb20iLCJzdWIiOiJ0YWxiZXJ0aGVybmRvbjFAZ21haWwuY29tIiwiYXV0aG4iOnsic3ViIjoidGFsYmVydGhlcm5kb24xQGdtYWlsLmNvbSIsImlhbV9pZCI6IklCTWlkLTY5MTAwMDZEMVoiLCJuYW1lIjoiVGFsYmVydCBIZXJuZG9uIiwiZ2l2ZW5fbmFtZSI6IlRhbGJlcnQiLCJmYW1pbHlfbmFtZSI6Ikhlcm5kb24iLCJlbWFpbCI6InRhbGJlcnRoZXJuZG9uMUBnbWFpbC5jb20ifSwiYWNjb3VudCI6eyJ2YWxpZCI6dHJ1ZSwiYnNzIjoiZTM4ZWIzY2FmNjkzNDdlNWI4MmNkMmUzMjYzODZhNDkiLCJpbXNfdXNlcl9pZCI6IjExNDk2MzQ2IiwiaW1zIjoiMjc1Mzk2MCJ9LCJpYXQiOjE2OTg4NjMwNjIsImV4cCI6MTY5ODg2NjY2MiwiaXNzIjoiaHR0cHM6Ly9pYW0uY2xvdWQuaWJtLmNvbS9pZGVudGl0eSIsImdyYW50X3R5cGUiOiJ1cm46aWJtOnBhcmFtczpvYXV0aDpncmFudC10eXBlOnBhc3Njb2RlIiwic2NvcGUiOiJpYm0gb3BlbmlkIiwiY2xpZW50X2lkIjoiYngiLCJhY3IiOjEsImFtciI6WyJwd2QiXX0.EeEHbD2ZcCi6EI0NVB--lzpe4KCd9XXy6cuCaLZKM0XCUW3DibRjcCxYG-DSn5PmOK5L7jt3L0RpBUM2N9q0-c6pyW32j60IItlaZgZQSFZlr3Ec80K5om3NxqKHD8nCpSAETIFpZK5QgbuIIJnN5CvXzJMxkgR7QXeADanEi2K7xxOteNDTvL6y9WsTK000xTDOsAMg4vJLZdJE_M60DgIwLZC8INnOLZc1sIGmIk8ZYiuMS3HVCg2dkizqftn7wC6LD6nyBmvRqWbTmlrA3hzJijGw6p1HOG8UWH2-22roCh4b4iFX9nw8BPsKL3jAzKdpJ2nTENZBlb7GwHxvFw`
            }
        })

        // console.log(response.data.results)
        return res.send({ status: 200, data: response.data.results[0] });


    } catch (e) {
        console.log(e)
        throw e;
    }



}