import Trash from "../../assets/trash.svg?react"
import Plus from "../../assets/plus.svg?react"
import { twMerge as tm } from "tailwind-merge"
import { useState } from "react"
import Container from "./Container"
import getNewUUID from "../../utils/getNewUUID"

export default function Item({includePlus, setItems, itemKey}){
  const [itemValue, setItemValue] = useState("")
  const [cards, setCards] = useState([])
  const [deleted, setDeleted] = useState(false)

  function autoTextAreaResizing(event){
    const textarea = event.target
    textarea.style.height = "fit-content"
    textarea.style.height = textarea.scrollHeight + "px"
    if(textarea.value.length > 64){
      setItemValue(textarea.value.substr(0, 64))
    }else{
      setItemValue(textarea.value)
    }
  }

  function addNewCard() {
    const newUUID = getNewUUID(cards)
    const newCard = <Container cardOrList="card" key={newUUID} className="flex-shrink-0 col-span-2"><Item includePlus/></Container>
    setCards([...cards, newCard])
  }

  function deleteSelf(){
    if(!deleted){
      setDeleted(true)
    }else{
      setItems(items => {
        return items.filter((item) => parseInt(item.key) !== itemKey)
      })
    }
  }

  return (
    <div className="grid grid-cols-[auto_auto]">
      <textarea className="m-0 flex items-center border-none bg-transparent text-lightText dark:text-darkText text-base h-auto resize-none mt-auto mb-auto pl-1 focus:rounded focus:outline focus:outline-1 focus:dark:outline-darkBackground focus:outline-lightBackground" value={itemValue} onInput={autoTextAreaResizing} rows={1} spellCheck={false} ></textarea>
      <div className="flex items-center justify-end">
        {includePlus ? <Plus className="cursor-pointer w-[--iconSize] h-[--iconSize] fill-lightText dark:fill-darkText" onClick={addNewCard}/> : ""}
        <Trash className={tm("cursor-pointer w-[--iconSize] h-[--iconSize] fill-lightText dark:fill-darkText", deleted && "fill-red-600 dark:fill-red-600")} onClick={deleteSelf} on/>
      </div>
      {cards.map(card => card)}
    </div>
  )
}