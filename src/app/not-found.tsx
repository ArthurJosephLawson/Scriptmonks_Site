import { ErrorView } from "@/components/error/error-view";
import { Button } from "@/components/ui/button";
import { NotFoundTerminal } from "@/components/layout/not-found-terminal";

export default function NotFound() {
  return (
    <>
      <ErrorView
        code={404}
        title="Page not found"
        message="We couldn't find that page. It may have moved, or the link may be wrong."
        actions={
          <>
            <Button href="/work" variant="secondary">
              VIEW WORK
            </Button>
            <Button href="/arcade" variant="secondary">
              PLAY ARCADE
            </Button>
          </>
        }
      />
      <NotFoundTerminal />
    </>
  );
}
