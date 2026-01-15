import { useEffect, useState } from 'react';
import type { Document } from './type';
import { calcAge } from '../functions';

const DocumentCard = ({doc}: {doc:Document}) => {
    const [lastUpdate, setLastUpdate] = useState(calcAge(doc.updated))
    
    useEffect(()=>{
        const intervalId = setInterval(()=>{setLastUpdate(calcAge(doc.updated))}, 1000)

        return ()=>clearInterval(intervalId);
    })

    return(
        <div
          className="flex justify-between items-center bg-gray-50 p-3 rounded-md mb-2 hover:bg-gray-100 transition"
        >
          <div className="flex items-center">
            <span className="text-gray-500 mr-2">📄</span>
            <div>
              <p className="font-bold">{doc.name}</p>
              <p className="text-sm text-gray-600">
                {doc.type} • Updated {lastUpdate}
                {doc.version ? `• ${doc.version}` : ""}
              </p>
            </div>
          </div>
          <span className="text-gray-500">↓</span>
        </div>
    )
}
export default DocumentCard;