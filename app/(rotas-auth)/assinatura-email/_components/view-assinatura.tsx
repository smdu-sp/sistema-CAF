"use client";

import React, { forwardRef } from "react";
import Image from "next/image";
import Logo from "./logo";

interface AssinaturaProps {
  nome: string;
  cargo: string;
  unidade: string;
  secretaria: string;
  email: string;
  endereco: string;
  andar: string;
  endereco2: string;
  site: string;
  ramal: string;
  mode?: "display" | "copy";
}

export const ViewAssinatura = forwardRef<HTMLDivElement, AssinaturaProps>(
  (
    {
      nome,
      cargo,
      secretaria,
      email,
      endereco,
      andar,
      endereco2,
      site,
      ramal,
      unidade,
      mode = "display",
    },
    ref,
  ) => {
    const copyModeContainerStyle: React.CSSProperties = {
      width: "500px",
      padding: "20px",
      backgroundColor: "#ffffff",
      position: "fixed",
      left: "-9999px",
      top: "-9999px",
      zIndex: "-1",
      opacity: "1",
      height: "auto",
      overflow: "visible",
      pointerEvents: "none",
    };

    const copyModeCommonTextStyle: React.CSSProperties = {
      fontFamily: "Arial, sans-serif",
      fontSize: "12px",
      lineHeight: "1.2",
      color: "#333333",
      margin: 0,
      padding: 0,
    };

    const copyModeNameStyle: React.CSSProperties = {
      ...copyModeCommonTextStyle,
      fontWeight: "bold",
      fontSize: "18.5px",
    };

    const copyModeBoldStyle: React.CSSProperties = {
      ...copyModeCommonTextStyle,
      fontWeight: "bold",
    };

    if (mode === "copy") {
      return (
        <div id="assinatura-copia-oculta" ref={ref} style={copyModeContainerStyle}>
          <table
            cellPadding="0"
            cellSpacing="0"
            border={0}
            style={{ width: "100%" }}
            className="border-0 border-none"
          >
            <tbody>
              <tr>
                <td
                  style={{
                    paddingRight: "15px",
                    verticalAlign: "middle",
                    width: "200px",
                    border: "none",
                    borderColor: "transparent",
                    borderRight: "2px solid #cccccc",
                  }}
                >
                  <Logo />
                </td>
                <td style={{ paddingLeft: "15px", verticalAlign: "middle" }}>
                  <table
                    cellPadding="0"
                    cellSpacing="0"
                    border={0}
                    style={{ width: "100%", border: "none", borderColor: "transparent" }}
                  >
                    <tbody>
                      <tr>
                        <td>
                          <p style={{ ...copyModeNameStyle, marginBottom: "2px" }}>
                            {nome.toUpperCase()}
                          </p>
                          <p style={copyModeCommonTextStyle}>
                            {cargo.toUpperCase()} / {unidade.toUpperCase()}
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style={{ height: "12px" }}></td>
                      </tr>
                      <tr>
                        <td>
                          <p style={copyModeBoldStyle}>{secretaria.toUpperCase()}</p>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <a href={`mailto:${email}`} target="_blank" style={copyModeCommonTextStyle}>
                            {email}
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td style={{ height: "12px" }}></td>
                      </tr>
                      <tr>
                        <td>
                          <p style={copyModeCommonTextStyle}>
                            {endereco.replace("${andar}", andar)}
                          </p>
                          <p style={copyModeCommonTextStyle}>{ramal}</p>
                          <p style={copyModeCommonTextStyle}>{endereco2}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style={{ height: "12px" }}></td>
                      </tr>
                      <tr>
                        <td>
                          <a href={site} target="_blank" style={copyModeCommonTextStyle}>
                            {site.replace("https://", "")}
                          </a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    }

    return (
      <div id="assinatura" ref={ref} className="flex items-center p-4 bg-white">
        <Image
          src="/img_assinatura.png"
          alt="logo"
          width={200}
          height={200}
          className="mr-2"
        />
        <div className="border-l-[3px] border-gray-400 h-60 mr-4" />
        <div className="flex flex-col gap-4">
          <div>
            <p className="font-sans font-bold text-[18.5px]">{nome.toUpperCase()}</p>
            <p className="font-sans text-[12px]">
              {cargo.toUpperCase()} / {unidade.toUpperCase()}
            </p>
          </div>
          <div>
            <p className="font-sans font-bold text-[12px]">{secretaria.toUpperCase()}</p>
            <a href={`mailto:${email}`} target="_blank" className="font-sans text-[12px]">
              {email}
            </a>
          </div>
          <div>
            <p className="font-sans text-[12px]">{endereco.replace("${andar}", andar)}</p>
            <a href={`tel:${ramal}`} className="font-sans text-[12px]">
              {ramal}
            </a>
            <p className="font-sans text-[12px]">{endereco2}</p>
          </div>
          <div>
            <a href={site} target="_blank" className="font-sans text-[12px]">
              {site.replace("https://", "")}
            </a>
          </div>
        </div>
      </div>
    );
  },
);

ViewAssinatura.displayName = "ViewAssinatura";
