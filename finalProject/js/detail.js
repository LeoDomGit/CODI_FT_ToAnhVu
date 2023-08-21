$(document).ready(function() {
    loadData()
})

const url1 = 'https://students.trungthanhweb.com/api/';
const imageUrl = 'https://students.trungthanhweb.com/images/'
// Load Menu dropdown
function loadData() {
    if(localStorage.getItem('token') && localStorage.getItem('token') != null){
        const params = new URLSearchParams(window.location.search);
        if(!params.has('id')){
            window.location.replace('index.html')
        }
        var id = params.get('id');
        $.ajax({
            type: "GET",
            url: url1+'single',
            data: {
                apitoken : localStorage.getItem('token'),
                id : id
    
            },
            dataType: "JSON",
            success: function (res) {
                // Get value for dropdown Loại Sản Phẩm
                var categrories = res.categrories;
                // Get value for dropdown Thương Hiệu
                var brands = res.brands;
                if(categrories.length > 0){
                    str = '';
                    categrories.forEach(el => {
                        str +=`
                        <li>
                            <a class="dropdown-item text-primary" href="#">
                                `+el.name+`
                            </a>
                        </li>
                        `
                    });
                    $('#typePro').html(str);
                }
                if(brands.length > 0){
                    var str = '';
                    brands.forEach(el => {
                        str +=`
                        <li>
                            <a class="dropdown-item text-primary" href="#">
                                `+el.name+`
                            </a>
                        </li>
                        `
                    });
                    $('#thuonghieu').html(str);
                }
                // Get value for prouduct
                var products = res.products;
                if(products.length >0){
                    var str = '';
                    products.forEach(el => {
                        str =`
                        <tbody>
                            <tr>
                            <th scope="row">Tên sản phẩm</th>
                            <td><span id="nameProduct">`+el.name+`</span></td>
                            </tr>
                            <tr>
                            <th scope="row" >Giảm giá</th>
                            <td><span id="discount">`+el.discount+`</span></td>
                            </tr>
                            <tr>
                            <th scope="row" >Giá</th>
                            <td><span id="price">`+Intl.NumberFormat('en-US').format(el.price*(100-el.discount)/100)+`</span></td>
                            </tr>
                            <tr>
                            <th scope="row">Thương hiệu</th>
                            <td><span id="brandname">`+el.brandname+`</span></td>
                            </tr>
                            <tr>
                            <th scope="row">Loại sản phẩm</th>
                            <td><span id="catename">`+el.catename+`</span></td>
                            </tr>
                        </tbody>
                        `
                    });              
                    $('#tablePro').html(str);
                }
                const gallery = res.gallery;
                // var str = '';
                gallery.forEach(el => {
                    var str = `
                    <div class="item">
                        <img src="`+el+`" alt="" class="w-100 sliderImage">
                    </div>
                    `;   
                    $('#carousel').append(str);
                });
                
                const product = res.products[0];
                // const image =imageUrl+products.images;
                // $('.productImg').attr('src',image);
                sliderImageChange();
                const content = product.content;
                $('#content').html(content);
                // Lấy sản phẩm cùng loại
                const cateProducts = res.cateproducts;
                const brandProducts = res.brandproducts;
                var str = '';
                cateProducts.forEach(el => {
                    str =`
                    <div class="item">
                        <div class="card">
                            <a href="">
                                <img src="`+imageUrl+el.image+`" class="card-img-top w-100" alt="...">
                            </a>
                            <div class="card-body">
                                <h5 class="card-title">`+el.name+`</h5>
                                <p class="card-text">`+Intl.NumberFormat('en-US').format(el.price)+`</p>
                                <a href="#" class="btn btn-primary">Chi tiết</a>
                            </div>
                        </div>
                    </div>
                    `;
                    
                    $('#sameCateProduct').append(str);
                    console.log(str);
                });
                brandProducts.forEach(el => {
                    str =`
                    <div class=" item">
                        <div class="card">
                            <a href="">
                                <img src="`+imageUrl+el.image+`" class="card-img-top w-100" alt="...">
                            </a>
                            <div class="card-body">
                                <h5 class="card-title">`+el.name+`</h5>
                                <p class="card-text">`+Intl.NumberFormat('en-US').format(el.price)+`</p>
                                <a href="#" class="btn btn-primary">Chi tiết</a>
                            </div>
                        </div>
                    </div>
                    `;
                    console.log(str)
                    $('#sameBrandProduct').append(str);
                });
                owl();
            }
        });  
        
    } 
}
function sliderImageChange(){
    $('.sliderImage').click(function (e) { 
        e.preventDefault();
        var src = $(this).attr('src');
        $('.productImg').attr('src',src);
    });
}
function owl(){
    $('.owl-carousel').owlCarousel({
        loop:true,
        margin:10,
        responsiveClass: true,
        responsive:{
            0:{
                items:2
            },
            900:{
                items:3
            }
        }
    })
}

