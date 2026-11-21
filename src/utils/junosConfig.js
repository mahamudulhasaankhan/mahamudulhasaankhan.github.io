// Juniper Junos OS Configuration Export for Mahamudul Hassan (Shihab)
export const JUNOS_CONFIG_CONTENT = `## Last commit: 2026-11-21 07:14:02 BDT by mahamudul
version 22.4R2-S1.4;
system {
    host-name amberit-core01;
    domain-name amberit.com.bd;
    time-zone Asia/Dhaka;
    
    engineer {
        name "Md Mahamudul Hassan (Shihab)";
        role "Assistant System Engineer";
        department "Core-Access Infrastructure Operations";
        organization "Amber IT Ltd";
        location "Navana Tower, Gulshan-1, Dhaka, Bangladesh";
        portfolio "https://mahamudul.me";
        github "https://github.com/mahamudulhasaankhan";
        linkedin "https://linkedin.com/in/md-mahamudul-hassan-khan";
        email "proxy@mahamudul.me";
    }

    authentication-order [ password radius ];
    login {
        user mahamudul {
            uid 2001;
            class super-user;
            authentication {
                encrypted-password "$6$amberit$coreAccessBgpEngineerSha512";
            }
        }
    }

    services {
        ssh {
            protocol-version v2;
            max-pre-authentication-packets 64;
            connection-limit 16;
        }
        netconf {
            ssh;
        }
    }
}

interfaces {
    ge-0/0/0 {
        description "Uplink to Amber IT Core Distribution Fabric";
        unit 0 {
            family inet {
                address 103.250.64.1/24;
            }
        }
    }
    xe-0/1/0 {
        description "10G Primary Transit Upstream - BDIX Navana Peering";
        unit 0 {
            family inet {
                address 10.100.0.1/30;
            }
        }
    }
    et-0/0/0 {
        description "100G Carrier DWDM Optical Backbone Interface";
        unit 0 {
            family inet {
                address 172.16.0.1/30;
            }
        }
    }
    lo0 {
        description "Core Loopback System Interface";
        unit 0 {
            family inet {
                address 103.250.64.254/32;
            }
        }
    }
}

routing-options {
    router-id 103.250.64.254;
    autonomous-system 138378;
}

protocols {
    bgp {
        group AMBER-CORE-IBGP {
            type internal;
            local-address 103.250.64.254;
            neighbor 10.100.0.2 {
                description "Amber IT Core Aggregation Node 02";
            }
        }
        group TRANSIT-EBGP {
            type external;
            export [ BGP-OUT-PERMIT ];
            neighbor 103.250.65.5 {
                description "Upstream Transit AS58717";
                peer-as 58717;
            }
        }
    }
    mpls {
        interface ge-0/0/0.0;
        interface xe-0/1/0.0;
    }
    ospf {
        area 0.0.0.0 {
            interface lo0.0 {
                passive;
            }
            interface ge-0/0/0.0;
        }
    }
}

certifications {
    cisco-networking-academy "Linux Essentials (ID: f5bd7451-b763-45ed-9adf-b76832b7a123)";
    bdnog-21 "Advanced BGP Routing & Traffic Engineering Workshop";
    bdnog-22-ttt "Train the Trainer (TTT) Certified Instructor";
    apnic-academy "IPv6 Architecture, BGP Multihoming & Routing Security";
    mikrotik "MTCNA Enterprise Routing & Bandwidth Traffic Queueing";
}

experience-history {
    record 01 {
        employer "Amber IT Ltd";
        title "Assistant System Engineer (Core-Access Team)";
        duration "2026 - Present";
        duties "Enterprise routing scale across Juniper, Cisco, and MikroTik. Central Syslog & disaster backup orchestration.";
    }
    record 02 {
        employer "A. K. Khan Telecom Limited";
        title "Technical Support Engineer (NOC Tier-2)";
        duration "2026 - 2026";
        duties "24/7 surveillance via Zabbix & LibreNMS. OSPF/BGP failover execution.";
    }
    record 03 {
        employer "Dot Internet";
        title "NOC Engineer Intern";
        duration "2025 - 2025";
        duties "MikroTik edge routing, GPON Optical Line Terminals (OLT) and ONU provision.";
    }
}
`

export function downloadJunosConfig() {
  const blob = new Blob([JUNOS_CONFIG_CONTENT], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'mahamudul.conf'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
