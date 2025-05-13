"use client"

interface LogoProps {
  size?: "default" | "large"
}

export default function Logo({ size = "default" }: LogoProps) {
  const isLarge = size === "large"

  return (
    <div className="flex items-center gap-2">
      <div
        className={`relative ${isLarge ? "w-16 h-16" : "w-8 h-8"} bg-gradient-to-br from-primary to-primary-accent rounded-lg overflow-hidden flex items-center justify-center`}
      >
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent"></div>
        <span className={`text-white font-bold ${isLarge ? "text-4xl" : "text-lg"}`}>C</span>
      </div>
      <h1 className={`${isLarge ? "text-4xl" : "text-xl"} font-bold`}>
        Campus<span className="text-primary">QA</span>
      </h1>
    </div>
  )
}
