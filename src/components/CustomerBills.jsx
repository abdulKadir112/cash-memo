import React, {useEffect,useState} from "react";

const CustomerBills = () => {

const [bills,setBills] = useState([]);

useEffect(()=>{

const savedBills =
JSON.parse(localStorage.getItem("bills")) || [];

setBills(savedBills);

},[]);

return(

<div className="p-6">

<h1 className="text-xl font-bold mb-4">
Customer Bills
</h1>

{bills.map((bill)=>(
<div
key={bill.id}
className="border p-4 mb-4 rounded"
>

<p>তারিখ: {bill.date}</p>

<p>মোট: {bill.total} ৳</p>

<p>নেট: {bill.net} ৳</p>

</div>
))}

</div>

);

};

export default CustomerBills;