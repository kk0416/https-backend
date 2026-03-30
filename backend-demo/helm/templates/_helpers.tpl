{{/*
Expand the name of the chart.
*/}}
{{- define "gaussian-backend-demo.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
*/}}
{{- define "gaussian-backend-demo.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Chart label.
*/}}
{{- define "gaussian-backend-demo.chart" -}}
{{ .Chart.Name }}-{{ .Chart.Version | replace "+" "_" }}
{{- end }}

{{/*
Common labels.
*/}}
{{- define "gaussian-backend-demo.labels" -}}
helm.sh/chart: {{ include "gaussian-backend-demo.chart" . }}
{{ include "gaussian-backend-demo.selectorLabels" . }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels.
*/}}
{{- define "gaussian-backend-demo.selectorLabels" -}}
app.kubernetes.io/name: {{ include "gaussian-backend-demo.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Extract hostname from a public URL for ingress rules.
Examples:
- http://example.com/      -> example.com
- https://example.com/app  -> example.com
- example.com              -> example.com
*/}}
{{- define "gaussian-backend-demo.ingressHost" -}}
{{- $publicUrl := default "" .Values.ingress.publicUrl | trim -}}
{{- $withoutScheme := regexReplaceAll "^https?://" $publicUrl "" -}}
{{- $withoutPath := regexReplaceAll "/.*$" $withoutScheme "" -}}
{{- trimSuffix "/" $withoutPath -}}
{{- end }}
