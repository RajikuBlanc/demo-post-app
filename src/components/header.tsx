import {
  SignInButton,
  SignOutButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Button } from "./ui/button";

export default function Header() {
  return (
    <header className="flex h-14 items-center p-2 border-b-2">
      <span className="flex-1">ロゴ</span>
      <SignedIn>
        <ul className="flex gap-2 items-center">
          <li>
            <UserButton />
          </li>
          <li>
            <SignOutButton>
              <Button>ログアウト</Button>
            </SignOutButton>
          </li>
        </ul>
      </SignedIn>
      <SignedOut>
        <SignInButton>
          <Button variant="outline">ログイン</Button>
        </SignInButton>
        <SignUpButton>
          <Button>新規登録</Button>
        </SignUpButton>
      </SignedOut>
    </header>
  );
}
