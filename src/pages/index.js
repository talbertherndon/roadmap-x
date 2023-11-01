import Image from 'next/image'
import { Inter } from 'next/font/google'
import { } from 'react'
import { events } from '@/mock/events'
import { CardHeader, Typography } from '@material-tailwind/react'
import { generateArriveLeaveSchedule, generateNewSchedule, getEvents, watsonExample } from '@/utils/api'
import { useCallback, useEffect, useRef, Fragment, useState } from 'react';
import ReactCanvasConfetti from 'react-canvas-confetti'


const inter = Inter({ subsets: ['latin'] })
const locations = [
  {
    name: 'Edinburgh',
    people: [
      { name: 'Lindsay Walton', title: 'Front-end Developer', email: 'lindsay.walton@example.com', role: 'Member' },
      { name: 'Courtney Henry', title: 'Designer', email: 'courtney.henry@example.com', role: 'Admin' },
    ],
  },
  // More people...
]


function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}


export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false)
  const [schedules, setSchedules] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState();
  const [ibmKey, setIbmKey] = useState('');
  const runGeneration = async () => {
    if (!prompt || !ibmKey) return;
    setSchedules([])
    // setLoading(true);
    // watsonExample().then((res)=>{
    //   console.log(res)

    // })
    schedules.map(async (res) => {
      console.log(res)
      generateNewSchedule(res, prompt).then(async (res) => {

        const reason = await Promise.all(res.schedule.map(async (r, i) => {
          const response = await fetch('api/generate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              prompt: `I am a ${prompt}, give a detailed reason why I should attend ${r.title} from the infomation given?`,
              ibmKey: `${ibmKey}`
            })
          })
          const data = await response.json();
          console.log(data);
          const reason = data.data?.generated_text;
          res.schedule[i] = { ...res.schedule[i], reason: reason }
          return reason;
          // res.schedule[i] = { ...res.schedule[i], reason: reason }
        }))
        console.log(reason)
        setSchedules(prev => [...prev, res]);
        setLoading(false);


        fire();
      })


    })

    console.log(schedules);


  }

  const refAnimationInstance = useRef(null);

  const getInstance = useCallback(instance => {
    refAnimationInstance.current = instance;
  }, []);

  const makeShot = useCallback((particleRatio, opts) => {
    refAnimationInstance.current &&
      refAnimationInstance.current({
        ...opts,
        origin: { y: 0.7 },
        particleCount: Math.floor(200 * particleRatio)
      });
  }, []);


  const fire = useCallback(() => {
    makeShot(0.25, {
      spread: 26,
      startVelocity: 55
    });

    makeShot(0.2, {
      spread: 60
    });

    makeShot(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8
    });

    makeShot(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2
    });

    makeShot(0.1, {
      spread: 120,
      startVelocity: 45
    });
  }, [makeShot]);

  useEffect(() => {
    getEvents();
    setSchedules(events);
  }, [])

  return (
    <div className='mx-auto max-w-5xl py-32 sm:py-18 lg:py-56'>
      <header class="absolute inset-x-0 top-0 z-50">
        <nav
          class="flex items-center justify-between p-6 lg:px-8"
          aria-label="Global"
        >
          <div class="hidden lg:flex lg:flex-1 lg:justify-end">
            <div class="cursor-pointer text-sm font-semibold leading-6 text-gray-900">Log out <span aria-hidden="true">&rarr;</span></div>
          </div>
        </nav>
      </header>
      <div>
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            RoadmapX 🗺️
          </h1>
          <p className="my-6 text-lg leading-8 text-gray-600">
            {" "}
            Navigate Your Future: Tailored Career Journeys to Beat Information Overload          </p>
        </div>
        <CardHeader
          variant="gradient"
          color="white"
          className="h-25 p-4 text-white/75"
        >
          <div class="flex">

            <div class="relative w-full">
              <input
                type="search"
                id="search-query"
                class="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-r-lg border-l-gray-50 border-l-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-l-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
                placeholder="I am a software engineer and I need a plan..."
                required
                value={prompt}
                onChange={(e) => {
                  setPrompt(e.target.value);
                }}
              />
              <Typography className='text-black text-center text-sm'>          please be sure to add your career and goals above and your ibmKey on the bottom.
</Typography>
            </div>
          </div>
          {/* <div className="relative flex w-full gap-2 ">
                    <Input
                      type="search"
                      // label="Type here..."
                      placeholder="I want a worksheet about how to train a dog..."
                      className=" text-black/75"
                      value={prompt}
                      onChange={(e) => {
                        setPrompt(e.target.value);
                      }}
                    />
                  </div> */}
        </CardHeader>
        <ReactCanvasConfetti
          refConfetti={getInstance}
          style={{
            position: 'fixed',
            pointerEvents: 'none',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0
          }}
        />
        <div class="mt-10 flex items-center justify-center gap-x-6">
          <button
            disabled={loading}
            onClick={runGeneration}
            className="cursor-pointer rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {loading ? "Loading..." : "Optimize"}
          </button>
          {/* <a
            href="https://curatork12.com/"
            class="text-sm font-semibold leading-6 text-gray-900"
          >
            Learn more <span aria-hidden="true">→</span>
          </a> */}
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">All Events</h1>
            <p className="mt-2 text-sm text-gray-700">
              A list of all the events in your conference including their location, speakers, and description.
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <button
              type="button"
              className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Add event
            </button>
          </div>
        </div>
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full">
                <thead className="bg-white">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3">
                      Title
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Actual Time
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Show up @
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Dip @
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Speakers
                    </th>

                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-3">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {schedules.map((event) => (
                    <Fragment key={event.date}>
                      <tr className="border-t border-gray-200">
                        <th
                          colSpan={5}
                          scope="colgroup"
                          className="bg-gray-50 py-2 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3 truncate max-w-sm"
                        >
                          {event.date}
                        </th>
                      </tr>
                      {event.schedule.map((s, sIdx) => (
                        <tr
                          key={sIdx}
                          className={classNames(sIdx === 0 ? 'border-gray-300' : 'border-gray-200', 'border-t')}
                        >
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3">
                            {s.title}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{s.time}</td>
                          {/* Allow multiple speakers... */}
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 truncate max-w-md">{s?.arrive}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 truncate max-w-md">{s?.leave}</td>

                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 truncate max-w-sm">{s.speaker}</td>
                          {/* <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 truncate max-w-md">{schedule.description}</td> */}
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3">
                            <a onClick={() => { setSelectedEvent(s) }} className="text-indigo-600 hover:text-indigo-900">
                              View<span className="sr-only">, {s.name}</span>
                            </a>
                          </td>
                        </tr>
                      ))}
                    </Fragment>
                  ))}
                </tbody>
              </table>

            </div>
          </div>
          <input
            type="search"
            id="search-query"
            class="block p-2.5 w-full mt-9 z-20 text-sm text-gray-900 bg-gray-50 rounded-r-lg border-l-gray-50 border-l-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-l-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
            placeholder="cmd: ibmcloud iam oauth-tokens"
            required
            value={ibmKey}
            onChange={(e) => {
              setIbmKey(e.target.value);
            }}
          />
        </div>
      </div>

      {selectedEvent && (
        <div
          class="relative z-10"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

          <div class="fixed inset-0 z-10 overflow-y-auto">
            <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                <div>
                  {/* <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">

                  </div> */}
                  <div class="mt-3 text-center sm:mt-5">
                    <h3
                      class="text-base font-semibold leading-6 text-gray-900"
                      id="modal-title"
                    >
                      {selectedEvent.title}
                    </h3>
                    <div class="mt-2">
                      <p class="text-sm text-gray-500">
                        {selectedEvent.reason}
                      </p>
                    </div>
                  </div>
                </div>
                <div class="mt-5 sm:mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedEvent();
                    }}
                    class="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}


    </div>
  )
}
