const button2 = document.querySelectorAll('.btn2');
const productName = document.querySelectorAll('.product-name');
const productPrice = document.querySelectorAll('.product-price');

var arr = [];
for(let i = 0; i < button2.length; i++) {
    const el = button2[i];
    el.addEventListener('click', ()=>{
        var nameI = productName[i].innerHTML;
        var priceI = productPrice[i].innerHTML;
        var obj = new Object();
        obj.name = nameI;
        obj.price = priceI;
        obj.quantity = 1;

        var check = 0;
        arr.forEach(el => {
            if(el.name == nameI){
                el.quantity++;
                check = 1;
            }
        });
        if(check == 0){
            arr.push(obj);
        }
        
        var str = '';
         var stt = 1;
        arr.forEach(element => {
        var sum = Number(element.price) * element.quantity;
        str += `
        <tr>
            <th>
            `+(stt++)+`
            </th>
            <th>
            `+element.name+`
            </th>
            <th>
            `+element.price+`
            </th>
            <th>
            `+element.quantity+`
            </th>
            <th>
            `+sum+` `+'Đồng'+`
            </th>
        </tr>
        `;
         });
         document.getElementById('cart').innerHTML = str;
    } );    
}
