import React, {useEffect} from 'react'
import axios from 'axios'

function Landingpage() {

    useEffect(() => {
        axios.get('http://localhost:5000/api/hello')
        .then(response =>console.log(response.data) )
    }, [])

    return (
        <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            width: '100%', height: '100vh'
        }}>
            <h1>랜딩 페이지!</h1>
        </div>
    )
}

export default Landingpage