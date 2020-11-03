import React, {useEffect} from 'react'
import axios from 'axios'

function Landingpage() {

    useEffect(() => {
        axios.get('http://localhost:5000/api/hello')
        .then(response =>console.log(response.data) )
    }, [])

    return (
        <div>
            Landingpage 렌딩페이지
        </div>
    )
}

export default Landingpage