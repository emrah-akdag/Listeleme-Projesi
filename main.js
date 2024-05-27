// DÜzenleme
let editFlag = false; //* Düzenleme modunda olup olmadığını belirtir.
let editElement; //* Düzenleme yapılan öğeyi temsil eder.
let editID = ""; // Düzenleme yaoılan öğenin benzersiz kimliği

// Gerekli HTML elementlerini seçme
const form = document.querySelector(".grocery-form");
const grocery = document.getElementById("grocery");
const list = document.querySelector(".grocery-list");
const alert = document.querySelector(".alert");
const submitBtn = document.querySelector(".submit-btn");
const clearBtn = document.querySelector(".clear-btn");

// ! Fonksiyonlar
const editItem = (e) => {
  const element = e.target.parentElement.parentElement.parentElement;
  editElement = e.target.parentElement.parentElement.previousElementSibling; //Düzenlme yapacağımız etiketi seçtik
  grocery.value = editElement.innerText; //* Düzenlediğimiz etiketin içeriğin inputa aktardık.
  editFlag = true;
  editID = element.dataset.id; // Düzenlenen öğenin kimliğini gönderdik
  submitBtn.textContent = "Düzenle"; // Düzenle butonuna tıklanıldığında  ekle butonu Düzenle olarak değişsin.
  console.log(editID)
};





const displayAlert = (text, action) => {
  alert.textContent = text; //alert classlı etiketin içersini dışarıdan gönderilen parametre ile değiştirdik .
  alert.classList.add(`alert-${action}`); ///* p atiketine dinamik class ekledik

  setTimeout(() => {
    alert.textContent = ""; //* p etikenin içerisini boş stringe çevirdik
    alert.classList.remove(`alert-${action}`); //* Eklediğimiz classı kaldırdık
  }, 2000);
};
//* Varsayılan değerlere dönderir
const setBackToDefault = () => {
  grocery.value = "";
  editFlag = false;
  editID = "";
  submitBtn.textContent = "Ekle";
};

const addItem = (event) => {
  //event olay anlamına gelir kısaca e yazabiliriz
  event.preventDefault(); //Formun gönderilme olayında  sayfayın yenilemesini engeller
  const value = grocery.value; //Inputun İçerisine girilen değeri aldık
  const id = new Date().getTime().toString(); //Benzersiz bir id oluşturduk.

  //* Eğer inputun içeris boş değilse ve düzenleme modunda değilse
  if (value !== "" && !editFlag) {
    const element = document.createElement("article"); //* yeni bir "article" öğesi oluştur.
    let attr = document.createAttribute("data-id"); // Yeni bir veri kimliği oluştur.
    attr.value = id;
    element.setAttributeNode(attr); //* Oluşturduğumuz id yi data özellik olarak set ettik
    element.classList.add("grocery-item"); // article etiketine class ekledik

    element.innerHTML = `
  <p class="title">${value} </p>
  <div class="btn-container">
    <button type="button" class="edit-btn">
      <i class="fa-solid fa-pen-to-square"></i>
    </button>
    <button class="delete-btn">
      <i class="fa-solid fa-trash"></i>
    </button>
  </div>
  `;
    ///*oluşturduğumuz bu butonlara olay izleyicileri ekleyebilmemiz için sectik
    const deleteBtn = element.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", deleteItem);
    const editBtn = element.querySelector(".edit-btn");
    editBtn.addEventListener("click", editItem);

    list.appendChild(element); // oluşturduğumuz "article" etiketini html'e ekledik
    displayAlert("Başarıyla Eklenildi", "success");
    //* Varsayılan değerlere döncerecek fonksiyon
    setBackToDefault();
    addToLocalStorage(id, value);
  } else if (value !== "" && editFlag) {
    editElement.innerHTML = value; //* Güncelleyeceğimiz elemanın içeriğini değiştirdik.
    displayAlert("Başarıyla Değiştirildi", "success");
    console.log(editID)
    editLocalStorage(editID, value)
    setBackToDefault();

   
  }
};
// silme butonuna tıklnaıldıgında çalışır
const deleteItem = (e) => {
  const element = e.target.parentElement.parentElement.parentElement; //* Sileceğimiz etikete kapsayıcıları yardımı ile ulaştık.
  const id = element.dataset.id;
  console.log(element);
  list.removeChild(element); // Buldumğumuz "article" etiketini list alanı içerisinden kaldırdık
  displayAlert("Başarıyla Kaldırıldı", "danger"); //* Ekrana gönderdiğimiz parametrelere göre bildirim bastırır.


  removeFromLocalStorage(id)
};


const clearItems = () => {
  const items = document.querySelectorAll(".grocery-item");
  console.log(items);
  //  * Liatede article elemanı varmı
  if (items.length > 0) {
    items.forEach((item) => list.removeChild(item)); //* forEach ile dizi içerisinde bulununan her bir elmanı dönüp her bir öğeyi listeden kaldırdık .
  }

  displayAlert("Liste Boş", "danger");
  localStorage.removeItem("list")
};

// yerel depoya öğe ekleme işlemi
const addToLocalStorage = (id, value) => {
  const grocery = { id, value };
  let items = getLocalStorage();
  items.push(grocery);
  console.log(items)
  localStorage.setItem("list", JSON.stringify(items));
};
// yerel depoda öğeleri alma işlmemi
function getLocalStorage() {
  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
}

// Yerel depodan id sine göre silme işlmemi
const removeFromLocalStorage = (id) => {
let items = getLocalStorage()
items = items.filter((item) => item.id !== id)
localStorage.setItem("list", JSON.stringify(items))
}

const editLocalStorage = (id, value) => {
  let items = getLocalStorage()
  items = items.map((item) => {
    if (item.id === id) {
      item.value = value
    }
    return item
  })
 console.log(items) 
 localStorage.setItem("list", JSON.stringify(items))
}

//Gönderilen id be value(değer) sahip bir öğe oluşturan fonksiyon

createListItem = (id, value)  => {
  const element = document.createElement("article"); //* yeni bir "article" öğesi oluştur.
  let attr = document.createAttribute("data-id"); // Yeni bir veri kimliği oluştur.
  attr.value = id;
  element.setAttributeNode(attr); //* Oluşturduğumuz id yi data özellik olarak set ettik
  element.classList.add("grocery-item"); // article etiketine class ekledik

  element.innerHTML = `
<p class="title">${value} </p>
<div class="btn-container">
  <button type="button" class="edit-btn">
    <i class="fa-solid fa-pen-to-square"></i>
  </button>
  <button class="delete-btn">
    <i class="fa-solid fa-trash"></i>
  </button>
</div>
`;
  ///*oluşturduğumuz bu butonlara olay izleyicileri ekleyebilmemiz için sectik
  const deleteBtn = element.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", deleteItem);
  const editBtn = element.querySelector(".edit-btn");
  editBtn.addEventListener("click", editItem);

  list.appendChild(element); // oluşturduğumuz "article" etiketini html'e ekledik
 
}

const setupItems =() =>{
  let items = getLocalStorage()
 
 if(items.length > 0) {
  items.forEach((item) => {
    createListItem(item.id,  item.value)
  })
 }
}

// ! Olay izleyicileri

// * Form gönderildiğinde addItem fonksiyonu çalıştır.
form.addEventListener("submit", addItem);
clearBtn.addEventListener("click", clearItems);
window.addEventListener("DOMContentLoaded",setupItems)
