$(document).ready(function() {
    login();
    logout();
    loadCart();
})
const url = 'https://students.trungthanhweb.com/api/';
// khai báo toast message
const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }                                    
})
//Login
function login() {
    $('#loginBtn').click(function(event){
        event.preventDefault();
        var modal = $('#loginModal')
        $('#loginModal').modal('show');
        $('#submitLoginBtn').click(function(event) {
            event.preventDefault();
            var email = $('#email').val().trim();
            if(email == ''){            
                Toast.fire({
                    icon: 'warning',
                    title: 'chưa nhập Email'
                })
            }
            else{
                $.ajax({
                    type : 'post',
                    url : 'https://students.trungthanhweb.com/api/checkLoginhtml',
                    data : {
                        email : email
                    },
                    dataType : 'JSON',
                    success : function(res) {
                        if(res.check == true){
                            console.log(res.apitoken);
                            localStorage.setItem('token', res.apitoken);
                            
                            Toast.fire({
                                icon: 'success',
                                title: 'Đăng nhập thành công'
                            }).then(()=>{
                                window.location.reload();
                            })
                        }
                        else{
                            
                            Toast.fire({
                                icon: 'error',
                                title: 'Đăng nhập thất bại'
                            }) 
                        }
                    }
                })
            }
        })
    })
}
//Logout
function logout() {
    $('#logoutBtn').click(function (e) { 
        e.preventDefault();
        if(localStorage.getItem('token') && localStorage.getItem('token') != null){
            localStorage.removeItem('token');
            Toast.fire({
                icon: 'info',
                title: 'Goodybe!!'
            }).then(()=>{
                $('#loginBtn').show();
                window.location.reload();
            })
           
        }
    });
}

var nextPage = url+'home';

//
function loadCart(){
    $('#todoTable').hide();
    $('#logoutBtn').hide();
    if(localStorage.getItem('cart') && localStorage.getItem('cart') !== null){
        $('#logoutBtn').show();
        $('#loginBtn').hide();
        var cart = localStorage.getItem('cart');
        var id = JSON.parse(cart)
        $.ajax({
            type: "get",
            url: url + "getCart",
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
                var result = res.result;
                console.log(result);
                if(result.length > 0){
                    var str = '';
                    var sum = 0;
                    result.forEach((el,key) => {
                        str +=`
                        <tr>
                            <th scope="row">`+(++key)+`</th>
                            <td class="">
                                <img src="`+el[3]+`" alt="" class="img-product">
                            </td>
                            <td>`+el[1]+`</td>
                            <td>`+Intl.NumberFormat('en-US').format(el[2])+`</td>
                            <td>`+el[4]+`</td>
                            <td>`+Intl.NumberFormat('en-US').format(el[5])+`</td>
                            <td>
                                <button class="btn btn-danger delCartPro" data-id="`+el[0]+`">Xóa</button>
                            </td>
                        </tr>
                        `;
                        sum += el[5];
                    });
                    str +=`
                    <tr>
                            <th colspan='5'scope="row">Tổng tiền</th>
                            <th colspan='2'scope="row">`+Intl.NumberFormat('en-US').format(sum)+`</th>
                    </tr>
                    `
                    $('#cartResult').html(str);
                }
                deleCartPro();
                
            }
        });
    }
}

function deleCartPro(){
    if(localStorage.getItem('cart') && localStorage.getItem('cart') !== null){
        var cart = localStorage.getItem('cart');
        var arr = JSON.parse(cart)
        console.log(arr);
        $('.delCartPro').click(function (e) { 
            e.preventDefault();
            var id = $(this).attr('data-id');
            console.log(id);
            Swal.fire({
                title: 'Bạn có chắc muốn xóa?',
                showDenyButton: true,
                showCancelButton: false,
                confirmButtonText: 'Delete',
                denyButtonText: `Ấn nhầm thôi!`,
            }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                    de
                } else if (result.isDenied) {
                
                }
            })
        });
    }
}