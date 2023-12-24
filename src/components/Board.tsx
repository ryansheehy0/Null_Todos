import { twMerge as tm } from "tailwind-merge"
import Container from "./Container/Container.js"
import { useGlobalContext } from "../utils/context.js"
import AddElement from "./Container/AddElement.js"
import Item from "./Container/Item.js"
import { useState } from "react"
import getNewUUID from "../utils/getNewUUID.js"

export default function Board(){
  const {globalState} = useGlobalContext()
  const [lists, setLists] = useState([])

  function addNewList(){
    const newUUID = getNewUUID(lists)
    const newList = <Container containerType="list" key={newUUID} className="flex-shrink-0"><Item includePlus setItems={setLists} itemKey={newUUID}/></Container>
    setLists([...lists, newList])
  }

  return (
    <div className={tm("w-[calc(100vw-var(--cardHeight))] overflow-auto h-screen bg-lightText dark:bg-darkText absolute top-0 right-0 flex justify-start", globalState.open && "w-[calc(100vw-(var(--cardWidth)+(2*var(--cardSpacing))))]")}>
      {lists.map(list => list)}
      <Container containerType="list" className="mr-[--cardSpacing]" onClick={addNewList}><AddElement text="Add another list" /></Container>
    </div>
  )
}