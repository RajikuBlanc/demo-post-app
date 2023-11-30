"use client";

import { FormState, createPost, updatePost } from "@/actions/post";
import { useFormState } from "react-dom";
import { Textarea } from "./ui/textarea";
import { faker } from "@faker-js/faker";

type Props =
  | {
      mode: "edit";
      editId: string;
      defaultValue: {
        image?: string | null;
        body: string;
      };
    }
  | {
      mode: "create";
    };

export default function PostForm(props: Props) {
  //   const { toast } = useToast();
  const [formState, formAction] = useFormState(
    async (_: FormState, formData: FormData) => {
      let action;
      if (props.mode === "create") {
        action = createPost(formData);
      } else {
        action = updatePost(props.editId, formData);
      }

      return action.then((result) => {
        if (result.status === "success") {
          //   toast({
          //     title: result.message,
          //   });
        } else if (result.status === "error") {
          //   toast({
          //     title: '入力内容を確認してください',
          //     variant: 'destructive',
          //   });
        }

        return result;
      });
    },
    {
      status: "idle",
    }
  );

  const defaultValue =
    props.mode === "edit"
      ? props.defaultValue
      : {
          image: null,
          body: faker.lorem.paragraph(),
        };

  return (
    <div>
      <form action={formAction}>
        <div className="space-y-6">
          <div className="w-80">画像</div>
          <div className="grid w-full gap-1.5">
            <label htmlFor="body">本文*</label>
            <Textarea
              required
              name="body"
              placeholder=""
              defaultValue={defaultValue.body}
              id="body"></Textarea>
            <p className="text-[0.8rem] text-muted-foreground">最大140文字</p>
            {formState.status === "error" &&
              formState.fieldErrors.body?.map((error) => {
                return (
                  <p key={error} className="text-red-500">
                    {error}
                  </p>
                );
              })}
          </div>
        </div>
      </form>
    </div>
  );
}
