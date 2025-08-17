import { EmojiPicker } from "frimousse";

export function CustomEmojiPicker({ onSelect }) {
  return (
    <EmojiPicker.Root
      onEmojiSelect={(emoji) => onSelect(emoji.emoji)}
      className="isolate flex h-[368px] w-full flex-col bg-dark-gray rounded-lg border-1 border-secondary/10 shadow-lg shadow-black/50"
    >
      <EmojiPicker.Search className="z-10 mx-2 mt-2 appearance-none rounded-md bg-primary border-1 text-secondary border-white/30 px-2.5 py-2 text-sm" />
      <EmojiPicker.Viewport className="mt-2 relative flex-1 outline-hidden [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
        <EmojiPicker.Loading className="absolute inset-0 flex items-center justify-center text-sm text-secondary/60">
          Loading…
        </EmojiPicker.Loading>
        <EmojiPicker.Empty className="absolute inset-0 flex items-center justify-center text-sm text-secondary/60">
          No emoji found.
        </EmojiPicker.Empty>
        <EmojiPicker.List
          className="select-none pb-1.5"
          components={{
            CategoryHeader: ({ category, ...props }) => (
              <div
                className="bg-purple-950 px-3 pt-3 pb-1.5 font-medium text-white/80 text-xs"
                {...props}
              >
                {category.label}
              </div>
            ),
            Row: ({ children, ...props }) => (
              <div className="scroll-my-1.5 px-1.5" {...props}>
                {children}
              </div>
            ),
            Emoji: ({ emoji, ...props }) => (
              <button
                className="flex size-9 items-center justify-center rounded-md text-lg cursor-pointer dark:data-[active]:bg-neutral-100 data-[active]:bg-neutral-800"
                {...props}
              >
                {emoji.emoji}
              </button>
            ),
          }}
        />
      </EmojiPicker.Viewport>
    </EmojiPicker.Root>
  );
}

export default CustomEmojiPicker;