"use client";
import { useEffect, useRef, useState } from "react";

export default function useClickOutside() {
    const [modal, setModal] = useState(false);
    const modalRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    const handleClickOutside = (event: MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
            setModal(false);
        }
    };
    return { modal, setModal, modalRef };
}
