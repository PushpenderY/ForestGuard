
"use client";
import dynamic from "next/dynamic";
const FireMap = dynamic(() => import("./FireMap"), {
    ssr: false,
    loading:() =>(
        <div>
            <div>
                <div/>
                <p>
                    Loading wildfire map...
                </p>
            </div>
        </div>
    ),
});
export default function FireMapWrapper(){
    return <FireMap/>;
}