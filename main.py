from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel
from typing import List
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

lista_tarefas = []
contador = 0
situacao_valida = ["nova","em andamento","pendente","cancelada"]
situacao_final = ["resolvida"]

origins = ['http://127.0.0.1:8000/tarefas/', 'http://localhost:5500',"http://127.0.0.1:5500",
          https://glittering-druid-b1e982.netlify.app/]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Tarefa(BaseModel):
    id: str | None
    descricao: str
    responsavel: str| None
    nivel: int
    situacao: str| None = situacao_valida[0]
    prioridade: int


@app.post("/tarefas/", status_code=201)
async def adicionar_tarefa(tarefa: Tarefa):
    niveis_validos = [1, 3, 5, 8]
    prioridade = [1,2,3]


    for tarefa_atual in lista_tarefas:
        if tarefa_atual.id == tarefa.id:
            raise HTTPException(404, detail="Tarefa já existe")


    if tarefa.nivel not in niveis_validos:
        raise HTTPException(404, detail="Digite Um Nível Válido")

    elif tarefa.prioridade not in prioridade:
        raise HTTPException(404, detail="Digite Uma Prioridade Válida")
    
    elif tarefa.situacao not in situacao_valida and tarefa.situacao not in situacao_final:
        raise HTTPException(404, detail="Digite Uma Situação Válida")
    
    global contador
    contador += 1
    tarefa.id = contador
    lista_tarefas.append(tarefa)
    return {"Mensagem": "Tarefa criada"}


#listar todas as tarefas
@app.get("/tarefas/")
async def listar_tarefa():
    return lista_tarefas

#listar por situacao
@app.get("/tarefas/{situacao}")
async def listar_situacao(situacao:str) -> List[Tarefa]:

    return [tarefa_atual for tarefa_atual in lista_tarefas if tarefa_atual.situacao == situacao]

#listar por nivel
@app.get("/tarefasnivel/{nivel}")
async def listar_nivel(nivel:int) -> List[Tarefa]:

    return [tarefa for tarefa in lista_tarefas if tarefa.nivel == nivel]

#listar por prioridade
@app.get("/tarefasprioridade/{prioridade}")
async def listar_prioridade(prioridade:int) -> List[Tarefa]:

    return [tarefa for tarefa in lista_tarefas if tarefa.prioridade == prioridade]



@app.delete("/tarefas/{tarefa_id}")
async def remover(tarefa_id: int):
    for tarefa_atual in lista_tarefas:
        if tarefa_atual.id == tarefa_id:
            lista_tarefas.remove(tarefa_atual)
            return {"Mensagem": "Tarefa Removida"}

    raise HTTPException(404, detail="Tarefa Não Encontrada")


@app.put("/tarefas/{tarefa_id}/{situacao}")
async def alterar_situacao(tarefa_id: int, situacao: str):
    for tarefa_atual in lista_tarefas:
        if tarefa_atual.id == tarefa_id and situacao in situacao_valida:
            tarefa_atual.situacao = situacao
            return {"Mensagem": "Situacao Alterada"}
            
            
        elif tarefa_atual.id == tarefa_id and tarefa_atual.situacao == situacao_valida[1] or tarefa_atual.situacao == situacao_valida[2]:
            if situacao in situacao_final:
                tarefa_atual.situacao = situacao
                return {"Mensagem": "Situacao Alterada"}
            
            
            tarefa_atual.situacao = situacao
            return {"Mensagem": "Situacao Alterada"}

    raise HTTPException(404, detail="Tarefa Não Encontrada")


