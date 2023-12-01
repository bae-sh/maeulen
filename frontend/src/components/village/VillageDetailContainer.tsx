'use client';

import Image from 'next/image';
import villageExample from '/public/images/village-detail-example.png';
import Button from '../Button';
import { useContext, useEffect, useId, useState } from 'react';
import { Mission, Quiz, Village } from '../../types';
import MissionItem from './MissionItem';
import exampleImg from 'public/images/example.png';
import { useRouter } from 'next/navigation';
import { getQuiz, getVillage, registerQuiz } from '../../service/village';
import { PositionContext } from '../../app/layout';
import { checkVillageDistance } from '../../app/util';
import {
  CHEERING_IMG_KEY,
  DESPAIR_IMG_KEY,
  NORMAL_IMG_KEY,
  USER_ID_KEY,
} from '../../constants';

type Props = {
  missions: Mission[];
  onClick: () => void;
  villageId: number;
};

export default function VillageDetailContainer({
  missions,
  onClick,
  villageId,
}: Props) {
  const [step, setStep] = useState<number>(1);

  const [clickedType, setClickedType] = useState<'O' | 'X' | '-'>('-');
  const OImgUrl = clickedType === 'O' ? '/images/O-blue.svg' : '/images/O.svg';
  const XImgUrl = clickedType === 'X' ? '/images/X-red.svg' : '/images/X.svg';

  const [modalOpen, setModalOpen] = useState(false);
  const [village, setVillage] = useState<Village>();
  const [quiz, setQuiz] = useState<Quiz>();
  const [isClosed, setIsClosed] = useState(false);

  const router = useRouter();
  const pos = useContext(PositionContext);

  const handleSuccessClick = () => {
    setModalOpen(true);
    const userId = Number('1');
    registerQuiz(userId, quiz.quiz.quiz_id);
  };

  useEffect(() => {
    (async () => {
      const res = await getVillage(villageId);
      setVillage(res);
      const userId = Number('1');
      const quiz = await getQuiz(villageId, userId);
      setQuiz(quiz);
    })();
  }, []);

  useEffect(() => {
    if (!village) return;

    const distance = checkVillageDistance({
      my_lat: pos.latitude,
      my_lon: pos.longitude,
      village_lat: Number(village.latitude),
      village_lon: Number(village.longitude),
    });
    console.log(distance <= Number(village.radius) * 15);
    setIsClosed(distance <= Number(village.radius) * 15);
  }, [village]);

  useEffect(() => {
    if (step === 4) {
      setTimeout(() => {
        router.push('/village');
      }, 2000);
    }
  }, [step]);

  return (
    <section>
      {
        {
          1: (
            <section>
              <div className="relative">
                <Image
                  src={villageExample}
                  alt="villageImg"
                  className="object-cover w-full shadow-bottom"
                />
                {isClosed ? (
                  <div className="absolute transform -translate-x-1/2 -translate-y-1/2 top-8 px-8 py-1 left-1/2 w-[327px] bg-dorong-orange-light text-xs rounded-md border-2 border-dorong-orange-main">
                    아직[{village.village_name}]에 도착하지 않았습니다.{' '}
                    {village.village_name}에 도착하면 퀘스트를 수행할 수 있어요.
                  </div>
                ) : (
                  <div className="absolute flex gap-2 transform -translate-x-1/2 -translate-y-1/2 top-4 left-1/2">
                    <div className="w-4 h-4 border-2 rounded-full opacity-50 border-dorong-primary-dark bg-dorong-primary-dark"></div>
                    <div className="w-4 h-4 border-2 rounded-full opacity-50 border-dorong-primary-dark"></div>
                    <div className="w-4 h-4 border-2 rounded-full opacity-50 border-dorong-primary-dark"></div>
                  </div>
                )}
              </div>
              <p className="mt-[52px] mx-5 text-sm text-dorong-gray-7">
                {village?.village_description}
              </p>
              <div className="absolute w-full h-[48px] px-6 bottom-12 text-dorong-white">
                <Button isAvailable={!isClosed} onClick={() => setStep(2)}>
                  퀘스트로 이동
                </Button>
              </div>
            </section>
          ),
          2: (
            <div className="flex flex-col items-center ">
              <div className="flex gap-2 mt-2">
                <div className="w-4 h-4 border-2 rounded-full opacity-50 border-dorong-primary-dark bg-dorong-primary-dark"></div>
                <div className="w-4 h-4 border-2 rounded-full opacity-50 border-dorong-primary-dark bg-dorong-primary-dark"></div>
                <div className="w-4 h-4 border-2 rounded-full opacity-50 border-dorong-primary-dark"></div>
              </div>
              <p className="mt-3 text-xs text-dorong-gray-5">
                5개 중 <span className="text-dorong-primary-main">3개</span>만
                성공해도 미션 클리어!
              </p>
              <ul className="flex flex-col gap-4 mt-7">
                {missions?.map((mission) => (
                  <MissionItem
                    mission={mission}
                    key={mission.user_mission_id}
                    onClick={onClick}
                  />
                ))}
              </ul>
              <div className="absolute w-full h-[48px] px-6 bottom-12 text-dorong-white">
                <Button
                  isAvailable={
                    missions.filter((mission) => mission.is_complete).length >=
                    3
                  }
                  onClick={() => setStep(3)}
                >
                  퀴즈로 이동
                </Button>
              </div>
            </div>
          ),
          3: (
            <section className="flex flex-col items-center w-full ">
              <div className="flex gap-2 mt-2">
                <div className="w-4 h-4 border-2 rounded-full opacity-50 border-dorong-primary-dark bg-dorong-primary-dark"></div>
                <div className="w-4 h-4 border-2 rounded-full opacity-50 border-dorong-primary-dark bg-dorong-primary-dark"></div>
                <div className="w-4 h-4 border-2 rounded-full opacity-50 border-dorong-primary-dark bg-dorong-primary-dark"></div>
              </div>
              <p className="mt-[74px] text-[36px] font-extrabold leading-[43.2px] text-dorong-primary-light mb-[8px]">
                Q
              </p>
              <div className="px-[24px] mb-[100px]">
                <div className="w-full border-dorong-primary-light border-[2px] rounded-xl">
                  <p className="text-[20px] font-bold leading-[23.6px] text-dorong-black px-[36px] py-[23px] ">
                    {quiz?.quiz.question}
                  </p>
                </div>
              </div>
              <div className="flex justify-center gap-[52px] w-full">
                <button onClick={() => setClickedType('O')}>
                  <Image src={OImgUrl} alt="O" width={120} height={120} />
                </button>
                <button onClick={() => setClickedType('X')}>
                  <Image src={XImgUrl} alt="X" width={120} height={120} />
                </button>
              </div>
              <div className="absolute w-full h-[48px] px-6 bottom-12 text-dorong-white">
                <Button
                  isAvailable={clickedType !== '-'}
                  onClick={handleSuccessClick}
                >
                  완료하기
                </Button>
              </div>
              {modalOpen && (
                <div className="fixed top-0">
                  <div className="w-screen h-screen opacity-50 bg-dorong-black"></div>
                  <div className="absolute flex flex-col items-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-dorong-white w-[327px] h-[410px] py-8 px-5 rounded-xl">
                    <p className="text-2xl font-bold text-dorong-primary-dark rounded-2xl">
                      {quiz?.quiz.answer === clickedType
                        ? '성공!'
                        : '다시 시도해볼까요?'}
                    </p>
                    <Image
                      src={'/images/avatar.png'}
                      width={176}
                      height={176}
                      alt="example"
                      className="my-[50px]"
                    />
                    {quiz?.quiz.answer === clickedType ? (
                      <button
                        className="flex justify-around w-full py-2 rounded-xl bg-dorong-primary-lightlight"
                        onClick={() => setStep(4)}
                      >
                        아이템 받으러 가기
                      </button>
                    ) : (
                      <div className="flex justify-around w-full">
                        <button
                          className="px-2 text-lg border-2 text-dorong-black rounded-xl border-dorong-primary-light"
                          onClick={() => {
                            setModalOpen(false);
                            router.push('/village');
                          }}
                        >
                          그만할게요 😭
                        </button>
                        <button
                          className="px-2 text-lg border-2 text-dorong-black rounded-xl border-dorong-primary-light"
                          onClick={() => {
                            setModalOpen(false);
                            setStep(3);
                          }}
                        >
                          다시 시도하기 🔥
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </section>
          ),
          4: (
            <section className="flex flex-col w-full pt-[140px] items-center relative h-screen bg-[#fff]">
              <h1 className="text-dorong-gray-7 text-[24px] font-bold leading-[28.32px] mb-[2px]">
                '
                <strong className="text-dorong-black text-[24px] font-extrabold leading-[28.32px]">
                  {village?.village_name}
                </strong>
                ' 마을 생산품
              </h1>
              <span className=" text-[40px] font-extrabold leading-[48px] inline-block text-dorong-primary-dark mb-[16px]">
                한라봉
              </span>
              <Image
                src="/images/item-7.png"
                alt="item"
                width={230}
                height={230}
                className="z-10"
              />
              <p className="text-dorong-gray-7 text-[20px] font-bold leading-[23.6px] mt-[31px] z-10">
                나의 아이템에 등록되었습니다.
              </p>
              <div className="absolute bottom-0 w-full h-2/3 bg-gradient-to-b from-dorong-white to-dorong-primary-light" />
            </section>
          ),
        }[step]
      }
    </section>
  );
}
