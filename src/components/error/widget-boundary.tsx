"use client";

import { Component, type ReactNode } from "react";

export interface WidgetBoundaryProps {
  children: ReactNode;
  /** Widget name for the client-side log (never shown to visitors). */
  label?: string;
}

interface WidgetBoundaryState {
  failed: boolean;
}

/**
 * Per-widget error boundary (SPEC_V5 §2.3): a failed widget shows a compact
 * bordered card and the rest of the page keeps working.
 */
export class WidgetBoundary extends Component<
  WidgetBoundaryProps,
  WidgetBoundaryState
> {
  state: WidgetBoundaryState = { failed: false };

  static getDerivedStateFromError(): WidgetBoundaryState {
    return { failed: true };
  }

  componentDidCatch(error: Error): void {
    console.error(`[widget] ${this.props.label ?? "widget"}: ${error.message}`);
  }

  render(): ReactNode {
    if (this.state.failed) {
      return (
        <div className="border border-dark-border bg-dark-surface p-4">
          <p className="flex flex-wrap items-center gap-2 font-mono text-xs tracking-widest text-muted-teal">
            <span className="text-accent-coral" aria-hidden>
              [ ! ]
            </span>
            <span>This part failed to load.</span>
            <button
              type="button"
              onClick={() => this.setState({ failed: false })}
              className="uppercase text-ink underline decoration-accent-coral underline-offset-4 hover:text-accent-coral"
            >
              [ RETRY ]
            </button>
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}
