/// <reference path="./index.d.ts" />

type GenericPromiseHandler = (...args:any[]) => void;

interface Document{
  createDocument(ns?:string, root?:string,doctype?:string): Document
}
