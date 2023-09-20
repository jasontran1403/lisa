import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { HiMenu } from "react-icons/hi";
import { HiBeaker } from "react-icons/hi2";
import { Link } from "react-router-dom";

import { Container } from "../components/utils";
import { checkUser } from "../helpers";

const Nav = () => {
    return (
        <nav className="text-gray-600 p-2 sm:p-0 text-base xl:text-lg font-medium bg-white py-4 lg:py-[1.1rem] xl:py-8 border-b shadow-sm fixed w-full z-50">
            <Container className="flex items-center justify-between py-2 xl:py-0">
                <div className="flex items-center space-x-12">
                    <Link to="/" className="flex items-center space-x-3">
                        <HiBeaker className="w-9 h-9 md:w-12 md:h-12 text-indigo-600" />
                    </Link>

                    <div className="space-x-4 xl:space-x-8 hidden md:block">
                        <Link
                            to="#personal"
                            className="transition-all duration-300 font-medium py-2 xl:py-3 hover:text-indigo-600"
                        >
                            Personal
                        </Link>
                        <Link
                            to="#business"
                            className="transition-all duration-300 font-medium py-2 xl:py-3 hover:text-indigo-600"
                        >
                            Business
                        </Link>
                        <Link
                            to="#how-it-work"
                            className="transition-all duration-300 font-medium py-2 xl:py-3 hover:text-indigo-600"
                        >
                            How it work
                        </Link>
                        <Link
                            to="#about-us"
                            className="transition-all duration-300 font-medium py-2 xl:py-3 hover:text-indigo-600"
                        >
                            About us
                        </Link>
                    </div>
                </div>

                {checkUser() ? (
                    <Link
                        to="/dashboard"
                        className="transition-all duration-300 px-3 lg:px-4 xl:px-8 font-medium py-2 xl:py-3 bg-indigo-600 text-white rounded-md focus:outline-none hover:bg-indigo-700 focus:ring focus:border-indigo-500 focus:ring-indigo-500/50"
                    >
                        Dashboard
                    </Link>
                ) : (
                    <div className="flex items-center space-x-3 hidden md:block">
                        <Link
                            to="/login"
                            className="transition-all duration-300 px-3 lg:px-4 xl:px-8 font-medium py-2 xl:py-3 hover:text-indigo-600"
                        >
                            Login
                        </Link>

                        <Link
                            to="/register"
                            className="transition-all duration-300 px-3 lg:px-4 xl:px-8 font-medium py-2 xl:py-3 bg-indigo-600 text-white rounded-md focus:outline-none hover:bg-indigo-700 focus:ring focus:border-indigo-500 focus:ring-indigo-500/50"
                        >
                            Sign Up
                        </Link>
                    </div>
                )}

                {!checkUser() && (
                    <div className="md:hidden relative">
                        <Menu as="div" className="relative inline-block text-left">
                            <Menu.Button className="inline-flex w-full justify-center rounded-md bg-indigo-600 p-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                                <HiMenu className="h-7 w-7" />
                            </Menu.Button>

                            <Transition
                                as={Fragment}
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                            >
                                <Menu.Items className="absolute right-0 mt-2 p-3 w-96 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    <div className="">
                                        <Menu.Item>
                                            <Link
                                                to="/#personal"
                                                className="block transition-all duration-300 font-medium py-2 hover:text-indigo-600"
                                            >
                                                Personal
                                            </Link>
                                        </Menu.Item>

                                        <Menu.Item>
                                            <Link
                                                to="/#business"
                                                className="block transition-all duration-300 font-medium py-2 hover:text-indigo-600"
                                            >
                                                Business
                                            </Link>
                                        </Menu.Item>

                                        <Menu.Item>
                                            <Link
                                                to="/#how-it-work"
                                                className="block transition-all duration-300 font-medium py-2 hover:text-indigo-600"
                                            >
                                                How it work
                                            </Link>
                                        </Menu.Item>

                                        <Menu.Item>
                                            <Link
                                                to="/#about-us"
                                                className="block transition-all duration-300 font-medium py-2 hover:text-indigo-600"
                                            >
                                                About us
                                            </Link>
                                        </Menu.Item>

                                        <Menu.Item>
                                            <Link
                                                to="/#personal"
                                                className="block transition-all duration-300 font-medium py-2 hover:text-indigo-600"
                                            >
                                                Personal
                                            </Link>
                                        </Menu.Item>

                                        <div className="flex items-center space-x-3">
                                            <Menu.Item>
                                                <Link
                                                    to="/login"
                                                    className="w-1/2 text-center transition-all duration-300 px-3 font-medium py-1.5 text-indigo-900 border border-indigo-900 rounded-md focus:outline-none hover:text-white hover:bg-indigo-700 focus:ring focus:border-indigo-500 focus:ring-indigo-500/50"
                                                >
                                                    Login
                                                </Link>
                                            </Menu.Item>

                                            <Menu.Item>
                                                <Link
                                                    to="/register"
                                                    className="transition-all block text-center w-1/2 duration-300 px-3 lg:px-4 xl:px-8 font-medium py-2 xl:py-3 border border-indigo-600 bg-indigo-600 text-white rounded-md focus:outline-none hover:bg-indigo-700 focus:ring focus:border-indigo-500 focus:ring-indigo-500/50"
                                                >
                                                    Sign Up
                                                </Link>
                                            </Menu.Item>
                                        </div>
                                    </div>
                                </Menu.Items>
                            </Transition>
                        </Menu>
                    </div>
                )}
            </Container>
        </nav>
    );
};

export default Nav;
