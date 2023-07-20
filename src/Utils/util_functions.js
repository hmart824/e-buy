//*input on change handler
export const onChangeHandler = (target ,state, setState) => {
    setState({...state , [target.name] : target.value});
}

//*clear the inputs having same class name
export const clearInputs = (className)=>{
    let lists = document.getElementsByClassName(className);
    Array.from(lists).forEach((el)=>{
        el.value = '';
    })
}

//*convert the date in month , day and year format
export const getDate = (date)=>{
    let d = new Date(date);
    let opts = {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }
    return d.toLocaleString('default' , opts);
  }

 export const getUniqueData = (itemArray , property)=>{
    let data = itemArray.map((item)=>{
        return item[property];
    })
    data = [...new Set(data)];
    return data;
  }