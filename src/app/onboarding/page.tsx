import React from "react";
import { createUser } from "../../actions/user";

export default function page() {
  return (
    <form action={createUser}>
      <label htmlFor="">名前</label>
      <input type="text" id="name" defaultValue="" required name="name" />
      <button>作成</button>
    </form>
  );
}
