export default function Loading() {
    return (
        <ul className='flex flex-col mb-2'>
          {[...Array(10)].map((movie, index) => (
            <li key={index} className='relative animate-pulse mb-10 mt-4'>
                <div className="flex flex-row mb-2 align-center">
                    <div className="rounded-full w-8 h-8 mr-2 bg-gray-600"></div>
                    <p className='mt-2 mb-1 h-4 rounded-lg w-1/2 bg-gray-800'></p>
                </div>
              <div className='aspect-square rounded-lg h-14 w-full overflow-hidden bg-gray-600'></div>
              <p className='mt-2 block h-4 rounded-lg bg-gray-800 text-sm font-medium'></p>
              <p className='mt-2 block h-4 rounded-lg bg-gray-800 text-sm font-medium'></p>
            </li>
          ))}
        </ul>
      )
}