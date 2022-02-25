const { ipcRenderer} = require('electron');
const Store=require("./store");
const fs=require("fs");

const store = new Store({
  configName: 'user-preferences',
  defaults: {}
});


function getStoreElement(element,key){
  let values="";
  if(store.get(key)!==undefined){
  values=store.get(key);
  }
  document.getElementById(element).value=values;
}
function setKey(name,value){
  store.set(name,value);
}
function getKey(name){
 return store.get(name);
}
function setStoreElement(element,key){
  let val=document.getElementById(element).value;
  store.set(key, val);
}
