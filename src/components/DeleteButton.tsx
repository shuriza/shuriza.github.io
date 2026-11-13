"use client";

export default function DeleteButton({ label = "Hapus" }: { label?: string }) {
  return (
    <button
      type="submit"
      onClick={(event) => {
        if (!window.confirm("Hapus item ini? Tindakan ini tidak dapat dibatalkan.")) {
          event.preventDefault();
        }
      }}
      className="text-red-400 hover:text-red-300"
    >
      {label}
    </button>
  );
}
