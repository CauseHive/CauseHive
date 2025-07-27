import { useState } from "react";

export default function AdminHomePage (){
    return(
        <>
            <main className="admin-homepage">
                <navbar/>
                <h1 className="admin-homepage__title">Welcome to the CauseHiveAdmin Panel</h1>
            </main>
        </>
    );
}