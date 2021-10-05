import { GetStaticProps } from "next";
import Link from "next/link";
import { FC, MouseEvent, TouchEvent, useEffect, useRef, useState } from "react";

interface IndexProps {
  products: { name: string; price: string; img: string }[];
}
type e = TouchEvent | MouseEvent;

const Index: FC<IndexProps> = ({ products }) => {
  const [isDragging, setIsDragging] = useState(false);
  const currIdxRef = useRef(0),
    startPosRef = useRef(0),
    currTranslRef = useRef(0),
    prevTranslRef = useRef(0),
    requestRef = useRef(0);
  const sliderContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    oncontextmenu = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };
  }, []);

  const getPositionX = (e: e) =>
    e.type.includes("mouse")
      ? (e as MouseEvent).pageX
      : (e as TouchEvent).touches[0].clientX;
  const setSliderPosition = () => {
    sliderContainerRef.current!.style.transform = `translateX(${currTranslRef.current}px)`;
  };
  const animate = () => {
    setSliderPosition();
    requestAnimationFrame(animate);
  };
  const touchStart = (e: e, i: number) => {
    setIsDragging(true);
    currIdxRef.current = i;
    startPosRef.current = getPositionX(e);
    requestRef.current = requestAnimationFrame(animate);
  };
  const touchEnd = () => {
    setIsDragging(false);
    cancelAnimationFrame(requestRef.current);
    const movedBy = currTranslRef.current - prevTranslRef.current;
    if (movedBy < -100 && currIdxRef.current < products.length - 1)
      currIdxRef.current += 1;
    if (movedBy > 100 && currIdxRef.current > 0) currIdxRef.current -= 1;
    currTranslRef.current = currIdxRef.current * -innerWidth;
    prevTranslRef.current = currTranslRef.current;
    setSliderPosition();
  };
  const touchMove = (e: e) => {
    if (isDragging)
      currTranslRef.current =
        prevTranslRef.current + getPositionX(e) - startPosRef.current;
  };

  return (
    <div
      className={`slider-container ${isDragging && "grabbing"}`}
      ref={sliderContainerRef}
    >
      {products.map(({ name, price, img }, i) => (
        <div
          key={i}
          className="slide"
          onTouchStart={(e) => touchStart(e, i)}
          onTouchEnd={touchEnd}
          onTouchMove={touchMove}
          onMouseDown={(e) => touchStart(e, i)}
          onMouseUp={touchEnd}
          onMouseLeave={touchEnd}
          onMouseMove={touchMove}
        >
          <h2>{name}</h2>
          <h4>{price}</h4>
          <img
            src={img}
            alt={name}
            onDragStart={(e) => {
              e.preventDefault();
            }}
          />
          <Link href="/">
            <a className="btn">Buy Now</a>
          </Link>
        </div>
      ))}
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const products = [
    {
      name: "Airpods",
      price: "$199",
      img: "https://i.ibb.co/y08W0Jx/image1.png",
    },
    {
      name: "iPhone 12",
      price: "$799",
      img: "https://i.ibb.co/NYdGg2q/image2.png",
    },
    {
      name: "iPad",
      price: "$599",
      img: "https://i.ibb.co/Jd3t4hQ/image3.png",
    },
  ];

  return {
    props: { products },
  };
};

export default Index;
