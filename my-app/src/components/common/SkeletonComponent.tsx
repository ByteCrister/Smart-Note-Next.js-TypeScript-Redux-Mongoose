import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonSearchNav() {
    return (
        <div className="w-[90%] md:w-[60%] flex items-center gap-3 shadow-sm p-3 bg-slate-400 bg-opacity-15 rounded-xl">
            <Skeleton className="backdrop-blur-md shadow-xl p-3 w-[20%] rounded-full" />
            <Skeleton className="backdrop-blur-md shadow-xl p-3 w-[60%] rounded-full" />
            <Skeleton className=" backdrop-blur-md shadow-xl p-3 w-[20%] rounded-full" />
        </div>
    )
}


export function SkeletonTable() {
    return (
        <section className="w-[90%] md:w-[60%] flex flex-col px-3 py-2 gap-2 bg-slate-500 bg-opacity-20">
            <div className="w-full flex justify-between gap-2">
                {
                    Array.from({ length: 5 }).map((_, index) => {
                        return <Skeleton key={index} className="backdrop-blur-3xl w-[20%] shadow-xl p-3  rounded" />
                    })
                }
            </div>
            <div className="w-full flex flex-col justify-between items-center gap-3">
                {
                    Array.from({ length: 6 }).map((_, index) => {
                        return <Skeleton key={index} className="backdrop-blur-3xl shadow-xl p-3 w-full rounded" />
                    })
                }
            </div>
        </section>
    )
}
