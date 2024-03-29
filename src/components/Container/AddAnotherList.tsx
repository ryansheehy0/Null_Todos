/*
 * This file is part of Null Todos.
 *
 * Null Todos is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Null Todos is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Null Todos. If not, see <https://www.gnu.org/licenses/>.
 */

import { twMerge as tm } from "tailwind-merge"
import Plus from "../../assets/plus.svg?react"
import { useGlobalContext } from "../../utils/context"

export default function AddAnotherList(){
  const {db, globalState} = useGlobalContext()

  async function addNewList(){
    // Create new list
    const newListId = await db.lists.add({
      name: "",
      cards: []
    })
    // Add new list to board's lists
    const board = await db.boards.get(globalState.boardId)
    await db.boards.update(globalState.boardId, {
      lists: [...board.lists, newListId]
    })
  }

  return (
    <div
      className={tm("rounded-xl py-1.5 px-3 min-w-[--cardWidth] w-min flex justify-center items-center min-h-[--cardHeight] h-fit my-[--cardSpacing] box-border ml-[--cardSpacing]", "bg-lightList dark:bg-darkList", "mr-[--cardSpacing]")}
      draggable="false"
      onClick={addNewList}>
        <div className="flex items-center justify-center text-lightText dark:text-darkText h-4 rounded-xl box-content">
          <Plus className="w-[--iconSize] h-[--iconSize]"/>
          Add another list
        </div>
    </div>
  )
}